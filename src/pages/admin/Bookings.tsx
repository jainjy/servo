import React from "react";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";
import { BookingsStats } from "@/components/admin/bookings/bookings-stats";
import { BookingsCalendar } from "@/components/admin/bookings/bookings-calendar";

const BookingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Réservations</h1>
        <p className="text-muted-foreground">Gérer toutes les réservations de services</p>
      </div>

      <BookingsStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingsTable />
        </div>
        <div>
          <BookingsCalendar />
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
