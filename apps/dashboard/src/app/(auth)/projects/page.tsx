import { Suspense } from 'react';
import ProjectListContainer from './components/project-list-container';
import CreateProjectButton from './components/create-project-button';
import Loading from './loading';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <CreateProjectButton />
      </div>

      <div>
        <div className="pt-6">
          {/* Suspense boundary for data streaming */}
          <Suspense fallback={<Loading />}>
            <ProjectListContainer />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
