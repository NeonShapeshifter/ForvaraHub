// src/pages/JoinCompany.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shield,
  Building2,
  Users,
  Check,
  X,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { useGlobalStore } from '../stores/useGlobalStore';
import { motion } from 'framer-motion';

interface InviteDetails {
  id: string;
  tenant: {
    id: string;
    nombre: string;
    ruc: string;
    logo_url?: string;
  };
  inviter: {
    nombre: string;
    apellido: string;
    email?: string;
  };
  rol: 'admin' | 'miembro' | 'viewer';
  expires_at: string;
  message?: string;
}

const JoinCompanyPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { addNotification } = useGlobalStore();
  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'error'>('loading');

  // Fetch invite details
  const { data: inviteDetails, loading, error } = useApi<InviteDetails>(
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invites/${token}`,
        {
          headers: user ? {
            'Authorization': `Bearer ${localStorage.getItem('forvara_token')}`
          } : {}
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid invitation');
      }
      
      return response.json();
    },
    { immediate: true }
  );

  // Accept invitation
  const { execute: acceptInvite, loading: accepting } = useApi(
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invites/${token}/accept`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('forvara_token')}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept invitation');
      }
      
      return response.json();
    }
  );

  useEffect(() => {
    if (error) {
      if (error.message.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
    } else if (inviteDetails) {
      setStatus('valid');
    }
  }, [error, inviteDetails]);

  const handleAccept = async () => {
    if (!user) {
      // Save the invite token and redirect to login
      localStorage.setItem('pending_invite', token || '');
      navigate('/login');
      return;
    }

    try {
      await acceptInvite();
      addNotification({
        type: 'success',
        title: 'Welcome to the team!',
        message: `You've joined ${inviteDetails?.tenant.nombre}`
      });
      
      // Refresh user data to get new tenant
      await refreshUser();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to join',
        message: error instanceof Error ? error.message : 'Could not accept invitation'
      });
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  const getRoleDescription = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'Full access to manage team, billing, and settings';
      case 'miembro':
        return 'Access to use apps and collaborate with the team';
      case 'viewer':
        return 'Read-only access to view company data';
      default:
        return 'Team member';
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface rounded-2xl p-8 border border-white/10 text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Invitation Expired</h1>
          <p className="text-text/60 mb-6">
            This invitation link has expired. Please ask the team admin to send you a new invitation.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface rounded-2xl p-8 border border-white/10 text-center"
        >
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
          <p className="text-text/60 mb-6">
            This invitation link is invalid or has already been used.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-medium text-text/60">Forvara</h1>
        </div>

        {/* Invitation Card */}
        <div className="bg-surface rounded-2xl p-8 border border-white/10">
          {inviteDetails && (
            <>
              {/* Company Info */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  You're invited to join
                </h2>
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {inviteDetails.tenant.nombre}
                </h3>
                <p className="text-text/60">
                  RUC: {inviteDetails.tenant.ruc}
                </p>
              </div>

              {/* Inviter Info */}
              <div className="bg-background rounded-xl p-4 mb-6">
                <p className="text-sm text-text/60 mb-2">Invited by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {inviteDetails.inviter.nombre[0]}{inviteDetails.inviter.apellido[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {inviteDetails.inviter.nombre} {inviteDetails.inviter.apellido}
                    </p>
                    {inviteDetails.inviter.email && (
                      <p className="text-sm text-text/60">{inviteDetails.inviter.email}</p>
                    )}
                  </div>
                </div>
                
                {inviteDetails.message && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-text/80 italic">"{inviteDetails.message}"</p>
                  </div>
                )}
              </div>

              {/* Role Info */}
              <div className="mb-8">
                <p className="text-sm text-text/60 mb-2">You'll join as</p>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium capitalize">{inviteDetails.rol}</span>
                </div>
                <p className="text-sm text-text/60">
                  {getRoleDescription(inviteDetails.rol)}
                </p>
              </div>

              {/* User Status */}
              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">Sign in required</p>
                      <p className="text-sm text-text/60 mt-1">
                        You'll need to sign in or create an account to accept this invitation
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      {user ? 'Accept & Join' : 'Sign In & Join'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text/50 mt-6">
          By joining, you agree to Forvara's terms of service and privacy policy
        </p>
      </motion.div>
    </div>
  );
};

export default JoinCompanyPage;
