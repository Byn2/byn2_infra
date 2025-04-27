"use client";

import { useState, useEffect } from "react";

export default function ApiStatusPage() {
  const [status, setStatus] = useState({
    overall: "operational",
    services: [
      { name: "API", status: "operational", uptime: "99.99%" },
      { name: "Dashboard", status: "operational", uptime: "99.98%" },
      { name: "Webhooks", status: "operational", uptime: "99.95%" },
      { name: "Payment Processing", status: "operational", uptime: "99.99%" },
      { name: "Authentication", status: "operational", uptime: "100%" },
    ],
    incidents: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch status
    const fetchStatus = async () => {
      try {
        // In a real app, you would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For demo purposes, randomly set one service to degraded performance
        const randomIndex = Math.floor(Math.random() * 5);
        if (Math.random() > 0.7) {
          const updatedServices = [...status.services];
          updatedServices[randomIndex].status = "degraded";

          setStatus({
            ...status,
            overall: "degraded",
            services: updatedServices,
            incidents: [
              {
                id: "inc-1",
                title: `${updatedServices[randomIndex].name} Performance Degradation`,
                status: "investigating",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                message: `We're currently investigating issues with the ${updatedServices[randomIndex].name} service.`,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "outage":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="mb-6 text-3xl font-bold">API Status</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Current status of Byn2 API services and recent incidents.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#01133B] border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-lg border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Current Status</h2>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  status.overall
                )}`}
              >
                {status.overall === "operational"
                  ? "All Systems Operational"
                  : "Service Degradation"}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-500">
                <div>Service</div>
                <div>Status</div>
                <div>Uptime (30 days)</div>
              </div>

              {status.services.map((service, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 border-t pt-4"
                >
                  <div className="font-medium">{service.name}</div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status === "operational"
                        ? "Operational"
                        : service.status === "degraded"
                        ? "Degraded Performance"
                        : "Outage"}
                    </span>
                  </div>
                  <div>{service.uptime}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Incidents</h2>

            {status.incidents.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No incidents reported in the last 30 days.
              </p>
            ) : (
              <div className="space-y-6">
                {status.incidents.map((incident) => (
                  <div key={incident.id} className="border-b pb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{incident.title}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          incident.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : incident.status === "monitoring"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {incident.status === "resolved"
                          ? "Resolved"
                          : incident.status === "monitoring"
                          ? "Monitoring"
                          : "Investigating"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {incident.message}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Updated: {new Date(incident.updated_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Historical Uptime</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Last 30 Days</h3>
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: "99.97%" }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">99.97% uptime</div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Last 90 Days</h3>
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: "99.95%" }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">99.95% uptime</div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Last 12 Months</h3>
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: "99.92%" }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">99.92% uptime</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Subscribe to Updates</h2>
            <p className="mb-4 text-sm text-gray-600">
              Get notified when there are service disruptions or maintenance
              windows.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button className="rounded-md bg-[#01133B] px-4 py-2 text-sm font-medium text-white hover:bg-[#523526]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
