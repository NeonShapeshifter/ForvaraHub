import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield, 
  X,
  AlertTriangle,
  Wifi,
  Globe
} from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { cn } from '@/lib/utils'

export default function ActiveSessions() {
  const {
    sessions,
    isLoading,
    loadSessions,
    revokeSession,
    revokeAllOtherSessions,
    getActiveSessions
  } = useSessionStore()
  
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const activeSessions = getActiveSessions()
  const currentSession = sessions.find(s => s.is_current)
  const otherSessions = sessions.filter(s => !s.is_current)

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return Monitor
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      default: return Monitor
    }
  }

  const getBrowserIcon = (browser: string) => {
    // Use Globe for all browsers since specific browser icons aren't available in lucide-react
    return Globe
  }

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevokingId(sessionId)
      await revokeSession(sessionId)
    } catch (error) {
      console.error('Failed to revoke session:', error)
      alert('Failed to revoke session. Please try again.')
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeAllOther = async () => {
    if (!confirm('Are you sure you want to sign out of all other devices? This will require you to sign in again on those devices.')) {
      return
    }

    try {
      setRevokingAll(true)
      await revokeAllOtherSessions()
    } catch (error) {
      console.error('Failed to revoke all sessions:', error)
      alert('Failed to revoke sessions. Please try again.')
    } finally {
      setRevokingAll(false)
    }
  }

  const getLocationString = (location: any) => {
    if (location.city === 'Detecting...') return 'Detecting location...'
    return `${location.city}, ${location.region}, ${location.country}`
  }

  const isRecentSession = (lastActivity: string) => {
    const date = new Date(lastActivity)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    return diff < 24 * 60 * 60 * 1000 // Less than 24 hours
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        <p className="text-gray-600">Manage where you're signed in to your Forvara account</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-gray-500">Across all devices</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSessions.length}</div>
            <p className="text-xs text-gray-500">Within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Monitor className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{sessions.filter(s => s.device_type === 'desktop').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{sessions.filter(s => s.device_type === 'mobile').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tablet className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{sessions.filter(s => s.device_type === 'tablet').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Session */}
      {currentSession && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              Current Session
            </CardTitle>
            <CardDescription>
              This is the device you're currently using
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  {React.createElement(getDeviceIcon(currentSession.device_type), {
                    className: 'h-6 w-6 text-green-600'
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{currentSession.device_name}</h3>
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {React.createElement(getBrowserIcon(currentSession.browser), {
                        className: 'h-4 w-4'
                      })}
                      <span>{currentSession.browser} on {currentSession.operating_system}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{getLocationString(currentSession.location)}</span>
                      <span className="text-gray-400">•</span>
                      <span>{currentSession.ip_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Active {formatLastActivity(currentSession.last_activity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Other Sessions</CardTitle>
              <CardDescription>
                These are other devices where you're signed in
              </CardDescription>
            </div>
            {otherSessions.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleRevokeAllOther}
                disabled={revokingAll}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {revokingAll ? 'Signing out...' : 'Sign out all devices'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {otherSessions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No other sessions</h3>
              <p className="text-gray-600">You're only signed in on this device</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherSessions.map((session) => {
                const isRecent = isRecentSession(session.last_activity)
                const DeviceIcon = getDeviceIcon(session.device_type)
                const BrowserIcon = getBrowserIcon(session.browser)
                
                return (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-lg",
                          isRecent ? "bg-blue-100" : "bg-gray-100"
                        )}>
                          <DeviceIcon className={cn(
                            "h-6 w-6",
                            isRecent ? "text-blue-600" : "text-gray-500"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{session.device_name}</h3>
                            {isRecent ? (
                              <Badge variant="secondary">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <BrowserIcon className="h-4 w-4" />
                              <span>{session.browser} on {session.operating_system}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{getLocationString(session.location)}</span>
                              <span className="text-gray-400">•</span>
                              <span>{session.ip_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Last active {formatLastActivity(session.last_activity)}</span>
                            </div>
                          </div>
                          
                          {!isRecent && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-orange-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Consider signing out inactive sessions for security</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokingId === session.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {revokingId === session.id ? (
                          <span className="text-xs">Signing out...</span>
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Regularly review your active sessions and sign out of devices you no longer use</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>If you see unfamiliar sessions, sign out immediately and change your password</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Enable two-factor authentication for additional security</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}