export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Peek-a-boo Feature Flag Platform
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Manage feature flags with confidence. Control, test, and deploy features seamlessly.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            Create Account
          </a>
        </div>
      </main>
    </div>
  );
}
