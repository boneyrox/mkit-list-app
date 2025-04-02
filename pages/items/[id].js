import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  BackButton,
  LoadingState,
  ErrorDisplay,
  PostDisplay,
} from "@/components/ui";
import { API_URL } from "@/constants";

// Constants
const ERROR_TYPES = {
  INVALID_FORMAT: "invalid_format",
  NOT_FOUND: "not_found",
  API_ERROR: "api_error",
  INVALID_DATA: "invalid_data",
  EXCEPTION: "exception",
};

// Helper functions
const isValidId = (id) => /^\d+$/.test(id) && parseInt(id) > 0;
const isValidPostData = (post) =>
  post && Object.keys(post).length > 0 && post.id;

const createErrorProps = (errorType, message, id) => ({
  props: {
    error: errorType,
    errorMessage: message,
    requestedId: id,
  },
});

// Static paths generation
export async function getStaticPaths() {
  try {
    // Pre-generate only posts with IDs 1-100
    const paths = Array.from({ length: 10 }, (_, index) => ({
      params: { id: (index + 1).toString() },
    }));

    console.log(`Pre-generating ${paths.length} post pages at build time`);
    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: "blocking" };
  }
}

// Static props generation
export async function getStaticProps({ params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!isValidId(id)) {
      console.log(`Invalid ID format: ${id}, returning error state`);
      return createErrorProps(
        ERROR_TYPES.INVALID_FORMAT,
        "The ID must be a positive number.",
        id
      );
    }

    // Fetch post data
    const res = await fetch(`${API_URL}/${id}`);

    // Handle HTTP errors
    if (!res.ok) {
      if (res.status === 404) {
        console.log(`Post ${id} not found, returning error state`);
        return createErrorProps(
          ERROR_TYPES.NOT_FOUND,
          "The requested post could not be found.",
          id
        );
      }

      console.error(`Failed to fetch post ${id}, status: ${res.status}`);
      return createErrorProps(
        ERROR_TYPES.API_ERROR,
        `Error retrieving post: HTTP ${res.status}`,
        id
      );
    }

    const post = await res.json();

    // Validate post data
    if (!isValidPostData(post)) {
      console.log(`Invalid post data for ID ${id}, returning error state`);
      return createErrorProps(
        ERROR_TYPES.INVALID_DATA,
        "The post data appears to be invalid or empty.",
        id
      );
    }

    // Return post data
    return { props: { post } };
  } catch (error) {
    console.error(`Error fetching post ${params.id}:`, error);
    return createErrorProps(
      ERROR_TYPES.EXCEPTION,
      "An unexpected error occurred while retrieving the post.",
      params.id
    );
  }
}

// Main component
export default function ItemDetail({ post, error, errorMessage, requestedId }) {
  const router = useRouter();
  const [clientError, setClientError] = useState(null);

  // Client-side validation
  useEffect(() => {
    if (router.isReady && router.query.id) {
      const id = router.query.id;
      if (!isValidId(id)) {
        setClientError({
          message: "Invalid post ID format. The ID must be a positive number.",
          id,
        });
      } else if (parseInt(id) > 1000) {
        setClientError({
          message: "Post ID is out of range. Please try a smaller number.",
          id,
        });
      }
    }
  }, [router.isReady, router.query.id]);

  // Content wrapper component
  const ContentWrapper = ({ children, title, description }) => (
    <PageLayout title={title} description={description}>
      <div className="max-w-2xl mx-auto p-6 my-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <BackButton />
        {children}
      </div>
    </PageLayout>
  );

  // Handle loading state
  if (router.isFallback) {
    return (
      <ContentWrapper
        title="Loading Post..."
        description="Loading item details"
      >
        <LoadingState />
      </ContentWrapper>
    );
  }

  // Handle error states (server or client-side)
  if (error || clientError) {
    const displayError = clientError?.message || errorMessage;
    const errorTitle =
      error === ERROR_TYPES.NOT_FOUND ? "Post Not Found" : "Error";
    const displayId = requestedId || clientError?.id || router.query.id;

    return (
      <ContentWrapper
        title={`${errorTitle} | Item Details`}
        description="There was an error retrieving the requested post"
      >
        <ErrorDisplay
          title={errorTitle}
          message={displayError}
          id={displayId}
        />
      </ContentWrapper>
    );
  }

  // Normal post rendering
  return (
    <ContentWrapper
      title={`${post.title} | Post Details`}
      description={post.body.substring(0, 160)}
    >
      <PostDisplay post={post} />
    </ContentWrapper>
  );
}
