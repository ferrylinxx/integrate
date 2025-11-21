"use client";

import { useState } from "react";
import { createAdmin } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCreateAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Starting admin creation test...");
      
      const { data, error } = await createAdmin(
        "test@example.com",
        "password123",
        "Test Admin"
      );

      console.log("Result:", { data, error });

      setResult({
        success: !error,
        data,
        error: error ? {
          message: error.message,
          name: error.name,
          stack: error.stack,
        } : null,
      });
    } catch (err) {
      console.error("Caught error:", err);
      setResult({
        success: false,
        error: err instanceof Error ? {
          message: err.message,
          name: err.name,
          stack: err.stack,
        } : String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Admin Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testCreateAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Testing..." : "Test Create Admin"}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">
                  Result: {result.success ? "✅ Success" : "❌ Error"}
                </h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

