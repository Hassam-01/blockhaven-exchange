import React, { useState, useEffect, useCallback } from 'react';
import { Star, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  getPublicTestimonials, 
  getMyTestimonial, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '@/lib/user-services-api';
import type { Testimonial, CreateTestimonialRequest, UpdateTestimonialRequest } from '@/lib/user-services-api';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [myTestimonial, setMyTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  
  // Check if user is logged in
  const authToken = localStorage.getItem('auth_token');
  const isLoggedIn = !!authToken;

  // Load public testimonials
  const loadTestimonials = async () => {
    try {
      const data = await getPublicTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  // Load user's testimonial if logged in
  const loadMyTestimonial = React.useCallback(async () => {
    if (!authToken) return;
    
    try {
      const data = await getMyTestimonial(authToken);
      setMyTestimonial(data);
    } catch (err) {
      console.error('Failed to load my testimonial:', err);
    }
  }, [authToken]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadTestimonials(),
        isLoggedIn ? loadMyTestimonial() : Promise.resolve()
      ]);
      setLoading(false);
    };

    loadData();
  }, [isLoggedIn, loadMyTestimonial]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setSubmitting(true);
    setError(null);

    try {
      const data: CreateTestimonialRequest | UpdateTestimonialRequest = {
        rating,
        text: text.trim()
      };

      if (isEditing && myTestimonial) {
        await updateTestimonial(authToken, myTestimonial.id, data);
        setSuccess('Testimonial updated successfully!');
      } else {
        await createTestimonial(authToken, data as CreateTestimonialRequest);
        setSuccess('Testimonial submitted successfully! It will be reviewed before being published.');
      }

      // Reset form and close dialog
      setRating(5);
      setText('');
      setShowDialog(false);
      setIsEditing(false);

      // Reload data
      await Promise.all([loadTestimonials(), loadMyTestimonial()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete testimonial
  const handleDelete = async () => {
    if (!authToken || !myTestimonial) return;

    try {
      await deleteTestimonial(authToken, myTestimonial.id);
      setSuccess('Testimonial deleted successfully!');
      setMyTestimonial(null);
      await loadTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  // Open edit dialog
  const openEditDialog = () => {
    if (myTestimonial) {
      setRating(myTestimonial.rating);
      setText(myTestimonial.text);
      setIsEditing(true);
      setShowDialog(true);
    }
  };

  // Open create dialog
  const openCreateDialog = () => {
    setRating(5);
    setText('');
    setIsEditing(false);
    setShowDialog(true);
  };

  // Render star rating
  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about BlockHaven.
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Add/Edit Testimonial Section - Only for logged in users */}
        {isLoggedIn && (
          <div className="mb-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Testimonial</span>
                  {myTestimonial && (
                    <Badge variant={myTestimonial.is_approved ? "default" : "secondary"}>
                      {myTestimonial.is_approved ? "Approved" : "Pending Review"}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {myTestimonial 
                    ? "You can edit or delete your existing testimonial."
                    : "Share your experience with BlockHaven to help others."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myTestimonial ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      {renderStars(myTestimonial.rating)}
                      <p className="mt-2 text-sm">{myTestimonial.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(myTestimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={openEditDialog} variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={handleDelete} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={openCreateDialog} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your Testimonial
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Public Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <blockquote className="text-sm mb-4 italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="text-sm font-medium">
                    {testimonial.user 
                      ? `${testimonial.user.first_name} ${testimonial.user.last_name}`
                      : 'Anonymous User'
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No testimonials available yet.</p>
            {isLoggedIn && (
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Be the First to Share Your Experience
              </Button>
            )}
          </div>
        )}

        {/* Add/Edit Testimonial Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Your Testimonial' : 'Add Your Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>
              <div>
                <Label htmlFor="text">Your Experience</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us about your experience with BlockHaven..."
                  required
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {text.length}/500 characters
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !text.trim()}>
                  {submitting ? 'Submitting...' : (isEditing ? 'Update' : 'Submit')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}