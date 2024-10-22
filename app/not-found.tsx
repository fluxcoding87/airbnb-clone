export const dynamic = "force-dynamic";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">
        The page you&apos;re looking for could not be found.
      </p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Go back to Home
      </a>
    </div>
  );
}
