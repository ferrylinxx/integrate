"use client";

import { IntegrateLogo } from "@/components/integrate-logo";
import { VersionBadge } from "@/components/version-badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, Shield, ArrowRight } from "lucide-react";

interface NavbarProps {
  showAdminButton?: boolean;
  showHomeButton?: boolean;
  showVersionBadge?: boolean;
  showTestButton?: boolean;
  transparent?: boolean;
}

export function Navbar({
  showAdminButton = false,
  showHomeButton = true,
  showVersionBadge = true,
  showTestButton = false,
  transparent = false
}: NavbarProps) {
  const router = useRouter();

  return (
    <nav className={`sticky top-0 z-50 border-b ${
      transparent
        ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm"
        : "bg-white border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {showVersionBadge && <VersionBadge position="navbar" size="sm" />}
          </div>

          <div className="flex items-center gap-3">
            {showHomeButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            )}
            {showAdminButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/login")}
                className="text-gray-600 hover:text-gray-900"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            {showTestButton && (
              <Button
                size="sm"
                onClick={() => router.push("/codigo")}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Hacer Test
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

