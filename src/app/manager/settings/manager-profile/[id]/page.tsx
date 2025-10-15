'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useManagerProfileStore } from '@/stores/salesCrmStore/useManagerProfileStore';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Phone, Save, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ManagerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  
  // Get manager ID from route params and company ID from user store
  const managerId = params.id as string;
  const companyId = user?.companyId;

  const { 
    profile, 
    isLoading, 
    isUpdating, 
    error, 
    fetchManagerProfile, 
    updateManagerProfile, 
    clearError 
  } = useManagerProfileStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (managerId && companyId) {
      fetchManagerProfile(managerId, companyId);
    } else if (!companyId) {
      toast.error('Company information not found. Please ensure you are logged in properly.');
    } else if (!managerId) {
      toast.error('Manager ID is required');
    }
  }, [fetchManagerProfile, managerId, companyId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Form validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateManagerProfile(formData);
      setIsEditing(false);
      toast.success('Manager profile updated successfully');
    } catch (error) {
      // Error is already handled by the store and displayed via toast
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
      });
    }
    setFormErrors({});
    setIsEditing(false);
  };

  const handleRefresh = () => {
    if (managerId && companyId) {
      fetchManagerProfile(managerId, companyId);
      toast.success('Manager profile refreshed');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Show loading or error states for missing required data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User information not found</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!managerId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Manager ID is required</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Company information not found</p>
          <p className="text-sm text-gray-400 mb-4">Please ensure you are logged in with a valid company account</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading manager profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load manager profile</p>
          <div className="space-x-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={handleGoBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account information</p>
            </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Manager ID</Label>
                <p className="font-mono text-sm">{profile._id}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p className={`font-medium ${profile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Company ID</Label>
                <p className="font-mono text-sm">{profile.company}</p>
              </div>
              {profile.lastLoginDate && (
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Last Login</Label>
                  <p className="font-medium">
                    {new Date(profile.lastLoginDate).toLocaleString()}
                  </p>
                </div>
              )}
              {profile.deviceTokens && profile.deviceTokens.length > 0 && (
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Device Tokens</Label>
                  <p className="text-sm text-muted-foreground">{profile.deviceTokens.length} device(s) registered</p>
                </div>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={formErrors.name ? 'border-red-500' : ''}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={formErrors.email ? 'border-red-500' : ''}
                  placeholder="Enter your email address"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile" className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Mobile Number</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  disabled={!isEditing}
                  className={formErrors.mobile ? 'border-red-500' : ''}
                  placeholder="Enter your mobile number"
                />
                {formErrors.mobile && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.mobile}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {!isEditing ? (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  variant="default"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}