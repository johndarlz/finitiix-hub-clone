import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, DollarSign, User } from "lucide-react";
import { Job } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
}

export const JobCard = ({ job, onApply, onSave }: JobCardProps) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(job.id);
    setSaved(true);
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatBudget = (min: number, max: number, negotiable: boolean) => {
    if (min === max) {
      return `$${min}${negotiable ? ' (Negotiable)' : ''}`;
    }
    return `$${min} - $${max}${negotiable ? ' (Negotiable)' : ''}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {job.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={saved ? "text-red-500" : ""}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{job.profiles?.name || 'Anonymous'}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {getCategoryLabel(job.category)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {formatBudget(job.budget_min, job.budget_max, job.budget_negotiable)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {job.delivery_time} days
          </Badge>
        </div>
        
        {job.important_instructions && (
          <div className="text-xs text-muted-foreground">
            <strong>Important:</strong> {job.important_instructions}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          onClick={() => onApply(job.id)}
          disabled={!user || user.id === job.user_id}
          className="flex-1"
        >
          {!user ? "Sign in to Apply" : user.id === job.user_id ? "Your Job" : "Apply Now"}
        </Button>
        <Button variant="outline" onClick={handleSave} disabled={!user}>
          Save Job
        </Button>
      </CardFooter>
    </Card>
  );
};