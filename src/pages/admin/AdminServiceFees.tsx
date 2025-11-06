import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Percent, Save, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceFee {
  id: string;
  fee_percentage: number;
  category: string;
  is_active: boolean;
  updated_at: string;
}

export default function AdminServiceFees() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [fees, setFees] = useState<ServiceFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServiceFees();
  }, []);

  const fetchServiceFees = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_service_fees')
        .select('*')
        .order('category');

      if (error) throw error;
      setFees(data || []);
    } catch (error) {
      console.error('Error fetching service fees:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load service fees'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async (id: string, newPercentage: number) => {
    if (newPercentage < 0 || newPercentage > 100) {
      toast({
        variant: 'destructive',
        title: 'Invalid percentage',
        description: 'Service fee must be between 0% and 100%'
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('platform_service_fees')
        .update({ 
          fee_percentage: newPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service fee updated successfully'
      });

      fetchServiceFees();
    } catch (error) {
      console.error('Error updating service fee:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update service fee'
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'short-stay': 'Short Stay',
      'rent': 'Long-term Rent',
      'buy': 'Property Sales'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'short-stay': 'bg-blue-500',
      'rent': 'bg-green-500',
      'buy': 'bg-purple-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Service Fees</h1>
        <p className="text-muted-foreground">
          Manage the service fees charged to guests for different property categories
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Impact
          </CardTitle>
          <CardDescription>
            Service fees are charged to guests and contribute to platform revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {fees.map((fee) => (
              <Card key={fee.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${getCategoryColor(fee.category)}`} />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {getCategoryLabel(fee.category)}
                    <Badge variant={fee.is_active ? 'default' : 'secondary'}>
                      {fee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`fee-${fee.id}`} className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Service Fee Percentage
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`fee-${fee.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={fee.fee_percentage}
                        onChange={(e) => {
                          const updatedFees = fees.map(f =>
                            f.id === fee.id
                              ? { ...f, fee_percentage: parseFloat(e.target.value) || 0 }
                              : f
                          );
                          setFees(updatedFees);
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleUpdateFee(fee.id, fee.fee_percentage)}
                        disabled={saving}
                        size="icon"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: {fee.fee_percentage}% of booking subtotal
                    </p>
                  </div>

                  <div className="pt-4 border-t space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Example booking:</span>
                      <span className="font-medium">$1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee:</span>
                      <span className="font-medium text-primary">
                        ${((1000 * fee.fee_percentage) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Guest pays:</span>
                      <span>${(1000 + (1000 * fee.fee_percentage) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Service fees are charged to guests in addition to the property price</p>
          <p>• These fees are separate from host commission rates</p>
          <p>• Changes take effect immediately for new bookings</p>
          <p>• Existing bookings are not affected by fee changes</p>
          <p>• Service fees contribute to platform revenue and maintenance costs</p>
        </CardContent>
      </Card>
    </div>
  );
}