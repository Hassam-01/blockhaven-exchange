import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Users,
  MessageSquare,
  DollarSign,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// API imports
import {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQStats,
  bulkUpdateFAQStatus,
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  getTestimonialStats,
  bulkApproveTestimonials,
  bulkRejectTestimonials,
  updateServiceFeeConfig,
  updateFixedRateFee,
  updateFloatingRateFee,
  //   getServiceFeeStats,
  getCurrentServiceFeeConfig,
  getServiceFeeHistory,
  resetServiceFeeConfig,
  checkAdminAccess,
  fetchPairs,
  fetchCurrencies,
} from "@/lib/dashboard-services-api";

import type {
  FAQStats,
  TestimonialStats,
  ServiceFeeStats,
  ServiceFeeHistory,
  BulkStatusRequest,
  BulkTestimonialRequest,
} from "@/lib/dashboard-services-api";

import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  Testimonial,
  ServiceFeeConfig,
  SetServiceFeeRequest,
} from "@/lib/user-services-api";

// Define the actual API response structure
interface FAQResponse {
  faqs: FAQ[];
}

interface TestimonialResponse {
  testimonials: Testimonial[];
}

interface AdminDashboardProps {
  onBack: () => void;
  token: string;
}

export function AdminDashboard({ onBack, token }: AdminDashboardProps) {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqStats, setFaqStats] = useState<FAQStats | null>(null);
  const [faqLoading, setFaqLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showFaqDialog, setShowFaqDialog] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  // Testimonial state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialStats, setTestimonialStats] =
    useState<TestimonialStats | null>(null);
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const [testimonialFilter, setTestimonialFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Service Fee state
  const [serviceFeeConfig, setServiceFeeConfig] = useState<ServiceFeeConfig | null>(null);
  const [serviceFeeStats, setServiceFeeStats] =
    useState<ServiceFeeStats | null>(null);
  const [serviceFeeHistory, setServiceFeeHistory] = useState<
    ServiceFeeHistory[]
  >([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [fixedRatePercentage, setFixedRatePercentage] = useState<string>("");
  const [floatingRatePercentage, setFloatingRatePercentage] =
    useState<string>("");

  // Exchange state
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeMessage, setExchangeMessage] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    const localStorageMode = localStorage.getItem('blockhaven-maintenance-mode');
    return localStorageMode ? localStorageMode === 'true' : import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  });

  // Form state
  const [faqForm, setFaqForm] = useState<CreateFAQRequest>({
    question: "",
    answer: "",
    is_active: true,
  });

  // Stats loading functions - defined early to be used in useEffect
  const loadFAQStats = React.useCallback(async () => {
    try {
      const stats = await getFAQStats(token);
      setFaqStats(stats);
    } catch (err) {
      console.error("Failed to load FAQ stats:", err);
    }
  }, [token]);

  const loadTestimonialStats = React.useCallback(async () => {
    try {
      const stats = await getTestimonialStats(token);
      setTestimonialStats(stats);
    } catch (err) {
      console.error("Failed to load testimonial stats:", err);
    }
  }, [token]);

  // Exchange functions
  const handleFetchPairs = React.useCallback(async () => {
    setExchangeLoading(true);
    setExchangeMessage(null);
    try {
      const result = await fetchPairs(token);
      setExchangeMessage(result.message || "Pairs fetched successfully");
    } catch (err) {
      setExchangeMessage(err instanceof Error ? err.message : "Failed to fetch pairs");
    } finally {
      setExchangeLoading(false);
    }
  }, [token]);

  const handleFetchCurrencies = React.useCallback(async () => {
    setExchangeLoading(true);
    setExchangeMessage(null);
    try {
      const result = await fetchCurrencies(token);
      setExchangeMessage(result.message || "Currencies fetched successfully");
    } catch (err) {
      setExchangeMessage(err instanceof Error ? err.message : "Failed to fetch currencies");
    } finally {
      setExchangeLoading(false);
    }
  }, [token]);

  const handleToggleMaintenanceMode = React.useCallback(() => {
    const newMode = !maintenanceMode;
    localStorage.setItem('blockhaven-maintenance-mode', newMode.toString());
    setMaintenanceMode(newMode);
    setExchangeMessage(`Maintenance mode ${newMode ? 'enabled' : 'disabled'}`);
  }, [maintenanceMode]);

  //   const loadServiceFeeStats = React.useCallback(async () => {
  //     try {
  //       const stats = await getServiceFeeStats(token);
  //       setServiceFeeStats(stats);
  //     } catch (err) {
  //       console.error('Failed to load service fee stats:', err);
  //     }
  //   }, [token]);

  // Check admin access on mount
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const hasAccess = await checkAdminAccess(token);
        if (!hasAccess) {
          setError("Access denied. Admin privileges required.");
          return;
        }
        // Load overview data
        setLoading(true);
        try {
          await Promise.all([
            loadFAQStats(),
            loadTestimonialStats(),
            // loadServiceFeeStats(),
          ]);
        } catch (err) {
          setError("Failed to load dashboard data.");
        } finally {
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to verify admin access.");
      }
    };

    verifyAdminAccess();
  }, [token, loadFAQStats, loadTestimonialStats]);

  // FAQ functions
  const loadFAQs = React.useCallback(async () => {
    setFaqLoading(true);
    try {
      const faqData = await getAllFAQs(token);
      if (
        faqData &&
        typeof faqData === "object" &&
        "faqs" in faqData &&
        Array.isArray((faqData as FAQResponse).faqs)
      ) {
        setFaqs((faqData as FAQResponse).faqs);
      } else if (Array.isArray(faqData)) {
        // Fallback for direct array response
        setFaqs(faqData);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      setError("Failed to load FAQs.");
      setFaqs([]); // Ensure it's always an array
    } finally {
      setFaqLoading(false);
    }
  }, [token]);

  const handleCreateFAQ = async () => {
    try {
      await createFAQ(token, faqForm);
      setFaqForm({ question: "", answer: "", is_active: true });
      setShowFaqDialog(false);
      await loadFAQs();
      await loadFAQStats();
    } catch (err) {
      setError("Failed to create FAQ.");
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFaq) return;
    try {
      await updateFAQ(token, editingFaq.id, faqForm);
      setEditingFaq(null);
      setFaqForm({ question: "", answer: "", is_active: true });
      setShowFaqDialog(false);
      await loadFAQs();
      await loadFAQStats();
    } catch (err) {
      setError("Failed to update FAQ.");
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    try {
      await deleteFAQ(token, faqId);
      await loadFAQs();
      await loadFAQStats();
    } catch (err) {
      setError("Failed to delete FAQ.");
    }
  };

  // Testimonial functions
  const loadTestimonials = React.useCallback(async () => {
    setTestimonialLoading(true);
    try {
      const isApproved =
        testimonialFilter === "all"
          ? undefined
          : testimonialFilter === "approved"
          ? true
          : false;
      const testimonialData = await getAllTestimonials(token, isApproved);
      // Handle the API response structure: { testimonials: [...] }
      if (
        testimonialData &&
        typeof testimonialData === "object" &&
        "testimonials" in testimonialData &&
        Array.isArray((testimonialData as TestimonialResponse).testimonials)
      ) {
        setTestimonials((testimonialData as TestimonialResponse).testimonials);
      } else if (Array.isArray(testimonialData)) {
        // Fallback for direct array response
        setTestimonials(testimonialData);
      } else {
        setTestimonials([]);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setError("Failed to load testimonials.");
      setTestimonials([]); // Ensure it's always an array
    } finally {
      setTestimonialLoading(false);
    }
  }, [token, testimonialFilter]);

  const handleApproveTestimonial = async (testimonialId: string) => {
    try {
      await approveTestimonial(token, testimonialId);
      await loadTestimonials();
      await loadTestimonialStats();
    } catch (err) {
      console.error("Error approving testimonial:", err);
      setError(`Failed to approve testimonial: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleRejectTestimonial = async (testimonialId: string) => {
    try {
      await rejectTestimonial(token, testimonialId);
      await loadTestimonials();
      await loadTestimonialStats();
    } catch (err) {
      setError("Failed to reject testimonial.");
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      await rejectTestimonial(token, testimonialId);
      await loadTestimonials();
      await loadTestimonialStats();
    } catch (err) {
      setError("Failed to delete testimonial.");
    }
  };

  // Service Fee functions
  const loadServiceFeeConfig = React.useCallback(async () => {
    setFeeLoading(true);
    try {
      const [currentConfig, history] = await Promise.all([
        getCurrentServiceFeeConfig(token).catch(() => null),
        getServiceFeeHistory(token).catch(() => []),
      ]);

      // Ensure history is always an array
      setServiceFeeHistory(Array.isArray(history) ? history : []);

      // Set the service fee config
      setServiceFeeConfig(
        currentConfig || {
          id: "",
          percentage: 0,
          is_active: true,
          created_at: "",
          updated_at: "",
        }
      );

      // Set the current values in the input fields based on the current config
      if (currentConfig && currentConfig.percentage !== undefined) {
        const percentage = currentConfig.percentage.toString();
        // Show the current percentage in both fields so user can see current values
        setFixedRatePercentage(percentage);
        setFloatingRatePercentage(percentage);
      } else {
        // Clear both fields if no config
        setFixedRatePercentage("");
        setFloatingRatePercentage("");
      }
    } catch (err) {
      console.error("Failed to load service fee data:", err);
      setError("Failed to load service fee data.");
      setServiceFeeHistory([]); // Ensure it's always an array
    } finally {
      setFeeLoading(false);
    }
  }, [token]);

  const handleUpdateServiceFee = async (
    type: "fixed-rate" | "floating",
    percentage: number
  ) => {
    try {
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        setError("Please enter a valid percentage (0-100).");
        return;
      }

      await updateServiceFeeConfig(token, { type, percentage });
      await loadServiceFeeConfig();
      //   await loadServiceFeeStats();
    } catch (err) {
      setError("Failed to update service fee.");
    }
  };

  const handleUpdateFixedRate = async () => {
    try {
      const percentage = parseFloat(fixedRatePercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        setError("Please enter a valid fixed rate percentage (0-100).");
        return;
      }

      await updateFixedRateFee(token, percentage);
      await loadServiceFeeConfig();
      setFixedRatePercentage("");
    } catch (err) {
      setError("Failed to update fixed rate.");
    }
  };

  const handleUpdateFloatingRate = async () => {
    try {
      const percentage = parseFloat(floatingRatePercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        setError("Please enter a valid floating rate percentage (0-100).");
        return;
      }

      await updateFloatingRateFee(token, percentage);
      await loadServiceFeeConfig();
      setFloatingRatePercentage("");
    } catch (err) {
      setError("Failed to update floating rate.");
    }
  };

  const handleResetServiceFee = async () => {
    try {
      await resetServiceFeeConfig(token);
      await loadServiceFeeConfig();
      //   await loadServiceFeeStats();
    } catch (err) {
      setError("Failed to reset service fee.");
    }
  };

  // Load data when tabs change
  useEffect(() => {
    if (activeTab === "faqs") {
      loadFAQs();
    } else if (activeTab === "testimonials") {
      loadTestimonials();
    } else if (activeTab === "fees") {
      loadServiceFeeConfig();
    }
  }, [activeTab, loadFAQs, loadServiceFeeConfig, loadTestimonials]);

  useEffect(() => {
    if (activeTab === "testimonials") {
      loadTestimonials();
    }
  }, [activeTab, testimonialFilter, loadTestimonials]);

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const openFaqDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        is_active: faq.is_active,
      });
    } else {
      setEditingFaq(null);
      setFaqForm({ question: "", answer: "", is_active: true });
    }
    setShowFaqDialog(true);
  };

  const toggleFaqExpansion = (faqId: string) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exchange
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your platform settings and content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="fees">Service Fees</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* FAQ Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">FAQs</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {faqStats?.stats?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {faqStats?.stats?.active || 0} active,{" "}
                    {faqStats?.stats?.inactive || 0} inactive
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Testimonials
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {testimonialStats?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {testimonialStats?.pending || 0} pending approval
                  </p>
                </CardContent>
              </Card>

              {/* Service Fee Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Service Fees
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Fixed Rate:</span>
                        <span className="text-xl font-semibold ">
                            {(serviceFeeConfig as any)?.fixedRateFee ?? 0}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Floating Rate:</span>
                        <span className="text-xl font-semibold ">
                            {(serviceFeeConfig as any)?.floatingRateFee ?? 0}%
                        </span>
                    </div>
                </div>
                </CardContent>
              </Card> 
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage FAQs</h2>
              <Button onClick={() => openFaqDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(faqs) &&
                      faqs.map((faq) => (
                        <React.Fragment key={faq.id}>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell 
                              onClick={() => toggleFaqExpansion(faq.id)}
                              className="text-center"
                            >
                              {expandedFaqs.has(faq.id) ? (
                                <ChevronDown className="w-4 h-4 mx-auto" />
                              ) : (
                                <ChevronRight className="w-4 h-4 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell 
                              className="font-medium max-w-md truncate cursor-pointer"
                              onClick={() => toggleFaqExpansion(faq.id)}
                            >
                              {faq.question}
                            </TableCell>
                            <TableCell onClick={() => toggleFaqExpansion(faq.id)}>
                              {getStatusBadge(
                                faq.is_active ? "Active" : "Inactive"
                              )}
                            </TableCell>
                            <TableCell onClick={() => toggleFaqExpansion(faq.id)}>
                              {new Date(faq.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openFaqDialog(faq)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteFAQ(faq.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedFaqs.has(faq.id) && (
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell colSpan={4} className="pt-0">
                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <p className="text-sm font-medium text-muted-foreground mb-2">
                                    Answer:
                                  </p>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {faq.answer}
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    {faqLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Loading FAQs...
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                    {!faqLoading &&
                      Array.isArray(faqs) &&
                      faqs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No FAQs found. Create your first FAQ to get
                              started.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Testimonials</h2>
              <Select
                value={testimonialFilter}
                onValueChange={(
                  value: "all" | "pending" | "approved" | "rejected"
                ) => setTestimonialFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(testimonials) &&
                      testimonials.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell className="font-medium">
                            {testimonial.user
                              ? `${testimonial.user.first_name} ${testimonial.user.last_name}`
                              : "Anonymous"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-1">{testimonial.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(
                              testimonial.is_approved ? "approved" : "pending"
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              testimonial.created_at
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {!testimonial.is_approved && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleApproveTestimonial(testimonial.id)
                                    }
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRejectTestimonial(testimonial.id)
                                    }
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteTestimonial(testimonial.id)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {testimonialLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Loading testimonials...
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                    {!testimonialLoading &&
                      Array.isArray(testimonials) &&
                      testimonials.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No testimonials found for the selected filter.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Fees Tab */}
          <TabsContent value="fees" className="mt-6">
            {/* Service Fee Type Updates */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Fixed Rate Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Set Fixed Rate Fee</CardTitle>
                  <CardDescription>
                    Set a fixed percentage fee for all transactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fixed-rate">
                      Fixed Rate Percentage (%)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="fixed-rate"
                        type="text"
                        value={fixedRatePercentage}
                        onChange={(e) => setFixedRatePercentage(e.target.value)}
                        placeholder={(serviceFeeConfig as any)?.fixedRateFee || "Enter percentage"}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        onClick={handleUpdateFixedRate}
                        disabled={!fixedRatePercentage}
                      >
                        Set Fixed Rate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Rate Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Set Floating Rate Fee</CardTitle>
                  <CardDescription>
                    Set a dynamic percentage fee based on market conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="floating-rate">
                      Floating Rate Percentage (%)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="floating-rate"
                        type="text"
                        value={floatingRatePercentage}
                        onChange={(e) =>
                          setFloatingRatePercentage(e.target.value)
                        }
                        placeholder={(serviceFeeConfig as any)?.floatingRateFee || "Enter percentage"}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        onClick={handleUpdateFloatingRate}
                        disabled={!floatingRatePercentage}
                      >
                        Set Floating Rate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exchanges Tab */}
          <TabsContent value="exchanges" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exchange Data Management</CardTitle>
                  <CardDescription>
                    Fetch and update currency pairs and currencies from external sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      onClick={handleFetchPairs}
                      disabled={exchangeLoading}
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      {exchangeLoading ? "Fetching..." : "Fetch Pairs"}
                    </Button>
                    <Button
                      onClick={handleFetchCurrencies}
                      disabled={exchangeLoading}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      {exchangeLoading ? "Fetching..." : "Fetch Currencies"}
                    </Button>
                  </div>
                  {exchangeMessage && (
                    <Alert className={exchangeMessage.includes("success") ? "border-green-500" : "border-red-500"}>
                      <AlertDescription>{exchangeMessage}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>
                    Enable maintenance mode to show a maintenance page to all users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Currently: {maintenanceMode ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <Button
                      onClick={handleToggleMaintenanceMode}
                      variant={maintenanceMode ? "destructive" : "default"}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      {maintenanceMode ? "Disable Maintenance" : "Enable Maintenance"}
                    </Button>
                  </div>
                  {maintenanceMode && (
                    <Alert className="border-orange-500">
                      <AlertDescription>
                        Maintenance mode is currently active. All users will see the maintenance page.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Dialog */}
      <Dialog open={showFaqDialog} onOpenChange={setShowFaqDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={faqForm.question}
                onChange={(e) =>
                  setFaqForm({ ...faqForm, question: e.target.value })
                }
                placeholder="Enter the FAQ question"
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={faqForm.answer}
                onChange={(e) =>
                  setFaqForm({ ...faqForm, answer: e.target.value })
                }
                placeholder="Enter the FAQ answer"
                rows={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={faqForm.is_active}
                onCheckedChange={(checked) =>
                  setFaqForm({ ...faqForm, is_active: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFaqDialog(false)}>
                Cancel
              </Button>
              <Button onClick={editingFaq ? handleUpdateFAQ : handleCreateFAQ}>
                {editingFaq ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
