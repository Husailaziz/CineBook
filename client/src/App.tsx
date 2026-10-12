import React from 'react';
import { Route, Switch } from 'wouter';
import { CityProvider } from './context/CityContext';
import { UserProvider } from './context/UserContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CityModal } from './components/common/CityModal';

import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { ShowtimesPage } from './pages/ShowtimesPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { FoodBeveragePage } from './pages/FoodBeveragePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OffersPage } from './pages/OffersPage';
import { CategoryPlaceholderPage } from './pages/CategoryPlaceholderPage';

export function App() {
  return (
    <CityProvider>
      <UserProvider>
        <div className="min-h-screen flex flex-col bg-[#f5f5f7] selection:bg-[#f84464]/20 selection:text-[#f84464]">
          <Navbar />
          <CityModal />

          <main className="flex-1">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/movie/:id" component={MovieDetailsPage} />
              <Route path="/movie/:id/shows" component={ShowtimesPage} />
              <Route path="/booking/:showId" component={SeatSelectionPage} />
              <Route path="/booking/:showId/snacks" component={FoodBeveragePage} />
              <Route path="/booking/:showId/checkout" component={CheckoutPage} />
              <Route path="/booking/confirmation/:bookingId" component={BookingConfirmationPage} />
              <Route path="/my-bookings" component={MyBookingsPage} />
              <Route path="/offers" component={OffersPage} />

              {/* Secondary category tabs */}
              <Route path="/stream">
                <CategoryPlaceholderPage
                  title="Cinebook Stream"
                  description="Rent and stream premier Hindi films and international cinema directly from the comfort of your home."
                  icon="🍿"
                />
              </Route>
              <Route path="/events">
                <CategoryPlaceholderPage
                  title="Live Hindi Music & Comedy Events"
                  description="Book passes for live Bollywood music concerts, standup comedy tours, and cultural fests across India."
                  icon="🎪"
                />
              </Route>
              <Route path="/plays">
                <CategoryPlaceholderPage
                  title="Theatre & Stage Plays"
                  description="Experience classical Hindi dramas, Shakespearean adaptations, and legendary Indian theatre performances."
                  icon="🎭"
                />
              </Route>
              <Route path="/sports">
                <CategoryPlaceholderPage
                  title="Sports & Stadium Passes"
                  description="Grab live match tickets for IPL, ISL, Pro Kabaddi, and premier Indian sporting leagues."
                  icon="🏏"
                />
              </Route>
              <Route path="/buzz">
                <CategoryPlaceholderPage
                  title="Cinebook Buzz"
                  description="Read the latest Bollywood gossip, box office collections, trailer breakdowns, and star interviews."
                  icon="⚡"
                />
              </Route>

              {/* 404 fallback */}
              <Route>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                  <h2 className="text-4xl font-black text-gray-900 font-display">404</h2>
                  <p className="text-sm text-gray-500 mt-2 mb-6">Page not found</p>
                  <a
                    href="/"
                    className="px-6 py-2.5 rounded-xl bg-[#f84464] text-white text-xs font-bold"
                  >
                    Go back home
                  </a>
                </div>
              </Route>
            </Switch>
          </main>

          <Footer />
        </div>
      </UserProvider>
    </CityProvider>
  );
}

export default App;
