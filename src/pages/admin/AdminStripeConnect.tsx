import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HostPaymentAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

export default function AdminStripeConnect() {
  const [accounts, setAccounts] = useState<HostPaymentAccount[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data: accountsData, error: accountsError } = await supabase
        .from('host_payment_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsError) throw accountsError;
      
      if (accountsData && accountsData.length > 0) {
        // Fetch profiles for all user_ids
        const userIds = accountsData.map(acc => acc.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          const profilesMap = new Map(profilesData.map(p => [p.id, p]));
          setProfiles(profilesMap);
        }
      }
      
      setAccounts(accountsData || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load Stripe Connect accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testPlatformConnection = async () => {
    setTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { test: true }
      });

      if (error) throw error;

      toast({
        title: "Test Successful",
        description: "Stripe Connect platform configuration is working correctly",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "Configuration Issue",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stripe Connect Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and troubleshoot Stripe Connect integration
          </p>
        </div>
        <Button onClick={fetchAccounts} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Platform Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>
            Verify that Stripe Connect platform settings are correctly configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Stripe Platform Profile</p>
              <p className="text-sm text-muted-foreground">
                Complete loss liability settings and platform information
              </p>
            </div>
            <Button asChild variant="outline">
              <a 
                href="https://dashboard.stripe.com/settings/connect/platform-profile" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Open Dashboard
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Test Configuration</p>
              <p className="text-sm text-muted-foreground">
                Verify that the platform can create Connect accounts
              </p>
            </div>
            <Button 
              onClick={testPlatformConnection} 
              disabled={testingConnection}
              variant="outline"
            >
              {testingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Common Issues:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Loss liability settings not configured</li>
              <li>Platform profile incomplete</li>
              <li>Country not supported by Stripe Connect</li>
              <li>Business verification pending</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Host Accounts Card */}
      <Card>
        <CardHeader>
          <CardTitle>Host Payment Accounts</CardTitle>
          <CardDescription>
            All Stripe Connect accounts created by hosts ({accounts.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No host payment accounts found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Stripe Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const profile = profiles.get(account.user_id);
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {profile?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{profile?.email || account.user_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">FR</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {account.stripe_account_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(account.is_verified)}
                          <span className="capitalize">
                            {account.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {account.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(account.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Documentation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start">
            <a 
              href="https://stripe.com/docs/connect/express-accounts" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Stripe Connect Express Documentation
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <a 
              href="https://stripe.com/docs/connect/supported-countries" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Supported Countries List
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <a 
              href="https://dashboard.stripe.com/logs" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Stripe API Logs
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
