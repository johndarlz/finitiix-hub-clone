import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, File, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  currentFile?: string;
  accept?: string;
  maxSize?: number;
  type: 'profile' | 'resume';
  className?: string;
}

const FileUpload = ({ onFileUploaded, currentFile, accept = "*/*", maxSize = 500000, type, className }: FileUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize / 1000}KB`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Delete old file if exists
      if (currentFile) {
        const oldFileName = currentFile.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('profile-files')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profile-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-files')
        .getPublicUrl(filePath);

      onFileUploaded(publicUrl);
      
      toast({
        title: "File uploaded successfully",
        description: `Your ${type === 'profile' ? 'profile picture' : 'resume'} has been updated.`
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const isImage = type === 'profile' || (currentFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(currentFile));

  return (
    <div className={className}>
      {currentFile ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isImage ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={currentFile} 
                      alt="Uploaded file" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <File className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {type === 'profile' ? 'Profile Picture' : 'Resume/CV'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentFile ? 'File uploaded' : 'No file selected'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = accept;
                    input.addEventListener('change', (e) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (file) {
                        uploadFile(file);
                      }
                    });
                    input.click();
                  }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Change'}
                </Button>
                {type === 'resume' && currentFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(currentFile, '_blank')}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.addEventListener('change', (e) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (file) {
                uploadFile(file);
              }
            });
            input.click();
          }}
        >
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              {type === 'profile' ? (
                <Image className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <h4 className="font-medium mb-2">
              {uploading ? 'Uploading...' : `Upload ${type === 'profile' ? 'Profile Picture' : 'Resume/CV'}`}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {type === 'profile' 
                ? 'JPG, PNG or GIF up to 500KB'
                : 'PDF, DOC, DOCX up to 500KB'
              }
            </p>
            <Button variant="outline" size="sm" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;