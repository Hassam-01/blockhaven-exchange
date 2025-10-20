import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Wave1,
  Wave2,
  Wave3,
  Wave4,
  Wave5,
} from "@/components/ui/wave-graphics";
import {
  getPublicTestimonials,
  getMyTestimonial,
  createTestimonial,
  createPublicTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getCurrentAuthToken,
  isAuthenticated,
} from "@/lib/user-services-api";
import type {
  Testimonial,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
} from "@/lib/user-services-api";

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
  const [text, setText] = useState("");

  // Reactive auth state (listen to global auth-state-changed events)
  const [authToken, setAuthToken] = useState<string | null>(() =>
    getCurrentAuthToken()
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    isAuthenticated()
  );

  // Listen for auth state changes triggered by login/logout or token expiration
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthToken(getCurrentAuthToken());
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    return () =>
      window.removeEventListener("auth-state-changed", handleAuthChange);
  }, []);

  // Load public testimonials
  const loadTestimonials = async () => {
    try {
      const data = await getPublicTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setError("Failed to load testimonials. Please try again later.");
    }
  };

  // Load user's testimonial if logged in
  const loadMyTestimonial = React.useCallback(async () => {
    if (!authToken) return;

    try {
      const data = await getMyTestimonial(authToken);
      setMyTestimonial(data);
    } catch (err) {
      console.error("Failed to load my testimonial:", err);
    }
  }, [authToken]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadTestimonials(),
        isLoggedIn ? loadMyTestimonial() : Promise.resolve(),
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

  // Handle form submission (supports anonymous submissions)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const data: CreateTestimonialRequest | UpdateTestimonialRequest = {
        rating,
        text: text.trim(),
      };

      if (isEditing && myTestimonial && authToken) {
        // Editing requires authentication
        await updateTestimonial(authToken, myTestimonial.id, data);
        setSuccess("Testimonial updated successfully!");
      } else {
        // Create: prefer authenticated endpoint if token exists, otherwise public
        if (authToken) {
          await createTestimonial(authToken, data as CreateTestimonialRequest);
        } else {
          // Use public create endpoint for anonymous users
          await createPublicTestimonial(data as CreateTestimonialRequest);
        }

        setSuccess(
          "Testimonial submitted successfully! It will be reviewed before being published."
        );
      }

      // Reset form and close dialog
      setRating(5);
      setText("");
      setShowDialog(false);
      setIsEditing(false);

      // Reload data
      await Promise.all([loadTestimonials(), loadMyTestimonial()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit testimonial"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete testimonial
  const handleDelete = async () => {
    if (!authToken || !myTestimonial) return;

    try {
      await deleteTestimonial(authToken, myTestimonial.id);
      setSuccess("Testimonial deleted successfully!");
      setMyTestimonial(null);
      await loadTestimonials();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete testimonial"
      );
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
    setText("");
    setIsEditing(false);
    setShowDialog(true);
  };

  // Render star rating
  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  // Scroll controls for horizontal testimonials list
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateScrollButtons());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [testimonials]);

  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 240);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden section-bg-alt">
        {/* Cloud Layers - Non-overlapping light pattern */}
        <Wave3 className="absolute top-20 left-1/6 w-1/7 h-auto opacity-[0.02] z-1 filter grayscale" />
        {/* <Wave1 className="absolute bottom-32 right-1/5 w-1/6 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" /> */}
        {/* <Wave2 className="absolute top-8 right-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale" /> */}
        <Wave4 className="absolute bottom-8 left-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden section-bg-alt">
      {/* Cloud Layers - Non-overlapping light pattern */}
      {/* <Wave2 className="absolute top-16 right-1/5 w-1/6 h-auto opacity-[0.02] z-1 filter grayscale" /> */}
      <Wave4 className="absolute bottom-24 left-1/6 w-1/7 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" />
      {/* <Wave1 className="absolute top-36 left-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale" /> */}
      <Wave3 className="absolute bottom-8 right-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about BlockHaven.
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

        {testimonials.length > 0 || myTestimonial ? (
          <div className="relative">
            {/* Left/Right controls */}
            <button
              aria-hidden={!canScrollLeft}
              aria-label="Scroll testimonials left"
              onClick={() => scrollByPage("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-opacity ${
                canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar"
              role="list"
              aria-label="Testimonials"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* User's own testimonial (if exists) */}
              {myTestimonial && (
                <Card
                  role="listitem"
                  className="h-full min-h-[280px] relative border-primary/50 flex-shrink-0 w-80 snap-start"
                >
                  {/* Edit/Delete actions */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      onClick={openEditDialog}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={
                        myTestimonial.is_approved ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {myTestimonial.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>

                  <CardContent className="p-6 flex flex-col h-full pt-12">
                    {/* Background quote image */}
                    <div
                      className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: "url('/quote.png')",
                        backgroundSize: "120px 120px",
                      }}
                    />

                    {/* Header with name and date */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-semibold">
                        {myTestimonial.user
                          ? `${myTestimonial.user.first_name} ${myTestimonial.user.last_name}`
                          : "You"}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(myTestimonial.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {/* Main content container - vertically centered */}
                    <div className="flex flex-col justify-between flex-1">
                      {/* Quote text - centered in available space */}
                      <div className="flex items-center justify-center flex-1 w-full">
                        <blockquote className="text-lg text-center leading-relaxed px-2 font-serif italic text-slate-700 dark:text-slate-300">
                          "{myTestimonial.text}"
                        </blockquote>
                      </div>

                      {/* Stars at bottom */}
                      <div className="flex justify-center w-full mt-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-10 h-10 ${
                                star <= myTestimonial.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Public testimonials */}
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  role="listitem"
                  className="h-full min-h-[280px] relative flex-shrink-0 w-80 snap-start"
                >
                  <CardContent className="p-6 flex flex-col h-full min-h-[280px] ">
                    {/* Background quote image */}
                    <div
                      className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: "url('/quote.png')",
                        backgroundSize: "120px 120px",
                      }}
                    />

                    {/* Header with name and date */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-semibold">
                        {testimonial.user
                          ? `${testimonial.user.first_name} ${testimonial.user.last_name}`
                          : "Anonymous User"}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {/* Main content container - vertically centered */}
                    <div className="flex flex-col justify-between flex-1">
                      {/* Quote text - centered in available space */}
                      <div className="flex items-center justify-center flex-1 w-full">
                        <blockquote className="text-lg text-center leading-relaxed px-2 font-serif italic text-slate-700 dark:text-slate-300">
                          "{testimonial.text}"
                        </blockquote>
                      </div>

                      {/* Stars at bottom */}
                      <div className="flex justify-center w-full mt-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= testimonial.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <button
              aria-hidden={!canScrollRight}
              aria-label="Scroll testimonials right"
              onClick={() => scrollByPage("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-md bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-opacity ${
                canScrollRight
                  ? "opacity-100"
                  : "opacity-30 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No testimonials available yet.
            </p>
            {!myTestimonial && (
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Be the First to Share Your Experience
              </Button>
            )}
          </div>
        )}

        {/* Add Testimonial Button - Only show if logged in and no testimonial exists */}
        {!myTestimonial && testimonials.length > 0 && (
          <div className="mt-8 text-center">
            <Button onClick={openCreateDialog} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Share Your Experience
            </Button>
          </div>
        )}

        {/* Add/Edit Testimonial Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Your Testimonial" : "Add Your Testimonial"}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !text.trim()}>
                  {submitting
                    ? "Submitting..."
                    : isEditing
                    ? "Update"
                    : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
