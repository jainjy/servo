import React from "react";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";
import { BookingsStats } from "@/components/admin/bookings/bookings-stats";
import { BookingsCalendar } from "@/components/admin/bookings/bookings-calendar";

const BookingsPage = () => {
  return (
    <div className="space-y-6 bg-[#FFFFFF0]" style={{ backgroundColor: '#FFFFFF0' }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#8B4513]">Réservations</h1>
        <p className="text-muted-foreground mt-1">Gérer toutes les réservations de services</p>
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