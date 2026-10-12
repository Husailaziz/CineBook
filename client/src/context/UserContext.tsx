import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking } from '../types';
import { cinebookApi } from '../api/cinebookApi';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  bookings: Booking[];
  refreshBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  isLoadingBookings: boolean;
}

const defaultUser: UserProfile = {
  name: 'Husail Abul Aziz',
  email: 'husail@example.com',
  phone: '9876543210'
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
  bookings: [],
  refreshBookings: async () => {},
  cancelBooking: async () => {},
  isLoadingBookings: false
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cinebook_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const refreshBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await cinebookApi.getBookings(user.email);
      setBookings(data);
    } catch (e) {
      console.error('Failed to load user bookings:', e);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, [user.email]);

  const updateUser = (profile: Partial<UserProfile>) => {
    const updated = { ...user, ...profile };
    setUser(updated);
    localStorage.setItem('cinebook_user', JSON.stringify(updated));
  };

  const handleCancelBooking = async (id: string) => {
    await cinebookApi.cancelBooking(id);
    await refreshBookings();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        bookings,
        refreshBookings,
        cancelBooking: handleCancelBooking,
        isLoadingBookings
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
