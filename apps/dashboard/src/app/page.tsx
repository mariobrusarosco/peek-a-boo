import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle, Info, Plus, Settings } from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Welcome to Peek-a-boo!</AlertTitle>
          <AlertDescription>
            This is your feature flag dashboard. Here you can manage all your feature flags and their configurations.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Flags</CardTitle>
              <CardDescription>Flags currently active in your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">12</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Environments</CardTitle>
              <CardDescription>Configured deployment environments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">3</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Projects</CardTitle>
              <CardDescription>Active projects in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">2</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Flag enabled</TableCell>
                  <TableCell>new-checkout</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      production
                    </div>
                  </TableCell>
                  <TableCell>10 minutes ago</TableCell>
                  <TableCell>John Doe</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Flag created</TableCell>
                  <TableCell>beta-features</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                      staging
                    </div>
                  </TableCell>
                  <TableCell>2 hours ago</TableCell>
                  <TableCell>Sarah Smith</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Environment added</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                      staging
                    </div>
                  </TableCell>
                  <TableCell>Yesterday</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center pt-4">
          <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="h-auto py-4 justify-start">
            <Plus className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Create Flag</div>
              <div className="text-xs opacity-70">Add a new feature flag</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Settings className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Project Settings</div>
              <div className="text-xs opacity-70">Manage your project</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <CheckCircle className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Check Status</div>
              <div className="text-xs opacity-70">System health</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start">
            <Info className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Documentation</div>
              <div className="text-xs opacity-70">Read the docs</div>
            </div>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
