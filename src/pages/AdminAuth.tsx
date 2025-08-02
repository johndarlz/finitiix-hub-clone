import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const adminAuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminAuthFormData = z.infer<typeof adminAuthSchema>;

export default function AdminAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminAuthFormData>({
    resolver: zodResolver(adminAuthSchema),
  });

  const onSubmit = async (data: AdminAuthFormData) => {
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up as admin
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: "Admin User",
              username: `admin_${Date.now()}`,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Add to admin_users table
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert([{
              user_id: authData.user.id,
              role: 'admin',
              permissions: ['all'],
            }]);

          if (adminError) throw adminError;

          toast({
            title: "Success",
            description: "Admin account created successfully!",
          });
          
          navigate("/admin");
        }
      } else {
        // Sign in
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) throw authError;

        // Check if user is admin
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Admin {isSignUp ? 'Sign Up' : 'Sign In'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Create an admin account to access the dashboard' 
              : 'Sign in to access the admin dashboard'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Admin Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? "Already have an admin account? Sign in" 
                : "Need to create an admin account? Sign up"
              }
            </Button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Warning:</strong> This is a secure admin area. Only authorized personnel should access this dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}