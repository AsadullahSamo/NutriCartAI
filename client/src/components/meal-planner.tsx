import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Plus, CalendarIcon, Trash2 } from "lucide-react";
import { CreateMealPlanDialog } from "./create-meal-plan-dialog";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  title: string;
  description: string;
  nutritionalInfo: string;
  preparationTime?: string;
}

interface DayMeals {
  day: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  totalCalories: number;
  nutritionSummary: string;
}

interface MealPlan {
  id: number;
  startDate: string;
  endDate: string;
  meals: DayMeals[];
}

interface MealCardProps {
  title?: string;
  meal: Meal;
  className?: string;
}

export function MealPlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const { data: mealPlans, isLoading } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/meal-plans");
      return res.json();
    },
  });

  const deleteMealPlanMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/meal-plans/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      toast({
        title: "Success",
        description: "Meal plan deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const activeMealPlan = mealPlans?.find((plan: MealPlan) => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    return selectedDate >= start && selectedDate <= end;
  });

  const selectedDayMeals = activeMealPlan?.meals?.find(
    (day: DayMeals) => day.day === Math.floor((selectedDate.getTime() - new Date(activeMealPlan.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meal Planner</h1>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Meal Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="mx-auto rounded-md border shadow-sm bg-card"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : selectedDayMeals ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                </div>
                {activeMealPlan && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this meal plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMealPlanMutation.mutate(activeMealPlan.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              
              <MealCard
                title="Breakfast"
                meal={selectedDayMeals.meals.breakfast}
                className="bg-orange-50 dark:bg-orange-950"
              />
              <MealCard
                title="Lunch"
                meal={selectedDayMeals.meals.lunch}
                className="bg-green-50 dark:bg-green-950"
              />
              <MealCard
                title="Dinner"
                meal={selectedDayMeals.meals.dinner}
                className="bg-blue-50 dark:bg-blue-950"
              />
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Snacks</h3>
                <div className="space-y-2">
                  {selectedDayMeals.meals.snacks.map((snack, index) => (
                    <MealCard
                      key={index}
                      meal={snack}
                      className="bg-purple-50 dark:bg-purple-950"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-secondary">
                <p className="font-semibold">Daily Summary</p>
                <p className="text-sm text-muted-foreground">
                  Total Calories: {selectedDayMeals.totalCalories}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDayMeals.nutritionSummary}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <p className="text-muted-foreground">
                No meal plan for this date.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
              >
                Create New Plan
              </Button>
            </div>
          )}
        </Card>
      </div>

      <CreateMealPlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

function MealCard({ title, meal, className = "" }: MealCardProps) {
  return (
    <Card className={`p-4 ${className}`}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <h4 className="font-medium">{meal.title}</h4>
      <p className="text-sm text-muted-foreground mt-1">
        {meal.description}
      </p>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{meal.nutritionalInfo}</span>
        {meal.preparationTime && (
          <span>Prep time: {meal.preparationTime}</span>
        )}
      </div>
    </Card>
  );
}