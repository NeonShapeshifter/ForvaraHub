import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CompanyMember, AppAssignment, DelegatePermission, UserRole } from '@/types'
import apiClient from '@/services/api'

interface RoleState {
  members: CompanyMember[]
  appAssignments: AppAssignment[]
  delegatePermissions: DelegatePermission[]
  userRole: UserRole | null
  isLoading: boolean
  
  // Actions
  loadMembers: () => Promise<void>
  loadUserRole: (userId: string, companyId: string) => Promise<void>
  assignUserToApp: (userId: string, appId: string) => Promise<void>
  revokeUserFromApp: (userId: string, appId: string) => Promise<void>
  createDelegate: (userId: string, appIds: string[], permissions: any) => Promise<void>
  removeDelegate: (userId: string, appId: string) => Promise<void>
  updateMember: (memberId: string, updates: Partial<CompanyMember>) => void
  
  // Utility functions
  isOwner: (userId: string) => boolean
  isDelegate: (userId: string, appId?: string) => boolean
  canUserAccessApp: (userId: string, appId: string) => boolean
  getUserApps: (userId: string) => string[]
  getDelegatedApps: (userId: string) => string[]
  getAvailableLicenses: (appId: string) => number
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      members: [],
      appAssignments: [],
      delegatePermissions: [],
      userRole: null,
      isLoading: false,

      loadMembers: async () => {
        try {
          set({ isLoading: true })
          // TODO: Replace with actual API call
          const mockMembers: CompanyMember[] = [
            {
              id: '1',
              user_id: '1',
              company_id: '1',
              role: 'owner',
              permissions: ['*'],
              joined_at: '2024-01-01T00:00:00Z',
              user: {
                id: '1',
                full_name: 'Alex Rodriguez',
                email: 'alex@forvara.com',
                phone: null,
                avatar_url: null,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                last_login: '2024-01-15T09:00:00Z',
                two_factor_enabled: false
              },
              app_assignments: [
                {
                  id: '1',
                  user_id: '1',
                  company_id: '1',
                  app_id: 'elaris',
                  assigned_at: '2024-01-01T00:00:00Z',
                  assigned_by: '1',
                  status: 'active'
                }
              ],
              delegate_permissions: []
            },
            {
              id: '2',
              user_id: '2',
              company_id: '1',
              role: 'member',
              permissions: [],
              joined_at: '2024-01-05T00:00:00Z',
              user: {
                id: '2',
                full_name: 'María García',
                email: 'maria@forvara.com',
                phone: null,
                avatar_url: null,
                created_at: '2024-01-05T00:00:00Z',
                updated_at: '2024-01-05T00:00:00Z',
                last_login: '2024-01-14T15:30:00Z',
                two_factor_enabled: false
              },
              app_assignments: [
                {
                  id: '2',
                  user_id: '2',
                  company_id: '1',
                  app_id: 'elaris',
                  assigned_at: '2024-01-05T00:00:00Z',
                  assigned_by: '1',
                  status: 'active'
                }
              ],
              delegate_permissions: [
                {
                  id: '1',
                  user_id: '2',
                  company_id: '1',
                  app_id: 'elaris',
                  granted_by: '1',
                  granted_at: '2024-01-05T00:00:00Z',
                  permissions: {
                    user_management: true,
                    app_configuration: true,
                    role_assignment: true
                  }
                }
              ]
            },
            {
              id: '3',
              user_id: '3',
              company_id: '1',
              role: 'member',
              permissions: [],
              joined_at: '2024-01-10T00:00:00Z',
              user: {
                id: '3',
                full_name: 'Carlos Mendoza',
                email: 'carlos@forvara.com',
                phone: null,
                avatar_url: null,
                created_at: '2024-01-10T00:00:00Z',
                updated_at: '2024-01-10T00:00:00Z',
                last_login: '2024-01-13T10:15:00Z',
                two_factor_enabled: false
              },
              app_assignments: [],
              delegate_permissions: []
            }
          ]
          
          set({ members: mockMembers, isLoading: false })
        } catch (error) {
          console.error('Load members error:', error)
          set({ isLoading: false })
        }
      },

      loadUserRole: async (userId, companyId) => {
        try {
          const members = get().members
          const member = members.find(m => m.user_id === userId && m.company_id === companyId)
          
          if (member) {
            const userRole: UserRole = {
              company_id: companyId,
              role: member.role === 'owner' ? 'owner' : 
                    member.delegate_permissions.length > 0 ? 'delegate' : 'member',
              app_specific_roles: {},
              assigned_apps: member.app_assignments.map(a => a.app_id),
              delegate_of_apps: member.delegate_permissions.map(d => d.app_id)
            }
            
            set({ userRole })
          }
        } catch (error) {
          console.error('Load user role error:', error)
        }
      },

      assignUserToApp: async (userId, appId) => {
        try {
          // TODO: API call
          console.log('Assigning user to app:', { userId, appId })
          
          // Update local state
          const members = get().members
          const updatedMembers = members.map(member => {
            if (member.user_id === userId) {
              const newAssignment: AppAssignment = {
                id: `assignment_${Date.now()}`,
                user_id: userId,
                company_id: member.company_id,
                app_id: appId,
                assigned_at: new Date().toISOString(),
                assigned_by: '1', // Current user
                status: 'active'
              }
              
              return {
                ...member,
                app_assignments: [...member.app_assignments, newAssignment]
              }
            }
            return member
          })
          
          set({ members: updatedMembers })
        } catch (error) {
          console.error('Assign user to app error:', error)
          throw error
        }
      },

      revokeUserFromApp: async (userId, appId) => {
        try {
          // TODO: API call
          console.log('Revoking user from app:', { userId, appId })
          
          // Update local state
          const members = get().members
          const updatedMembers = members.map(member => {
            if (member.user_id === userId) {
              return {
                ...member,
                app_assignments: member.app_assignments.filter(a => a.app_id !== appId)
              }
            }
            return member
          })
          
          set({ members: updatedMembers })
        } catch (error) {
          console.error('Revoke user from app error:', error)
          throw error
        }
      },

      createDelegate: async (userId, appIds, permissions) => {
        try {
          // TODO: API call
          console.log('Creating delegate:', { userId, appIds, permissions })
          
          // Update local state
          const members = get().members
          const updatedMembers = members.map(member => {
            if (member.user_id === userId) {
              const newDelegatePermissions = appIds.map(appId => ({
                id: `delegate_${appId}_${Date.now()}`,
                user_id: userId,
                company_id: member.company_id,
                app_id: appId,
                granted_by: '1', // Current user
                granted_at: new Date().toISOString(),
                permissions
              }))
              
              return {
                ...member,
                delegate_permissions: [...member.delegate_permissions, ...newDelegatePermissions]
              }
            }
            return member
          })
          
          set({ members: updatedMembers })
        } catch (error) {
          console.error('Create delegate error:', error)
          throw error
        }
      },

      removeDelegate: async (userId, appId) => {
        try {
          // TODO: API call
          console.log('Removing delegate:', { userId, appId })
          
          // Update local state
          const members = get().members
          const updatedMembers = members.map(member => {
            if (member.user_id === userId) {
              return {
                ...member,
                delegate_permissions: member.delegate_permissions.filter(d => d.app_id !== appId)
              }
            }
            return member
          })
          
          set({ members: updatedMembers })
        } catch (error) {
          console.error('Remove delegate error:', error)
          throw error
        }
      },

      updateMember: (memberId, updates) => {
        const members = get().members
        const updatedMembers = members.map(member =>
          member.id === memberId ? { ...member, ...updates } : member
        )
        set({ members: updatedMembers })
      },

      // Utility functions
      isOwner: (userId) => {
        const members = get().members
        const member = members.find(m => m.user_id === userId)
        return member?.role === 'owner'
      },

      isDelegate: (userId, appId) => {
        const members = get().members
        const member = members.find(m => m.user_id === userId)
        if (!member) return false
        
        if (appId) {
          return member.delegate_permissions.some(d => d.app_id === appId)
        }
        
        return member.delegate_permissions.length > 0
      },

      canUserAccessApp: (userId, appId) => {
        const members = get().members
        const member = members.find(m => m.user_id === userId)
        if (!member) return false
        
        // Owner can access everything
        if (member.role === 'owner') return true
        
        // Check app assignments
        return member.app_assignments.some(a => a.app_id === appId && a.status === 'active')
      },

      getUserApps: (userId) => {
        const members = get().members
        const member = members.find(m => m.user_id === userId)
        if (!member) return []
        
        return member.app_assignments
          .filter(a => a.status === 'active')
          .map(a => a.app_id)
      },

      getDelegatedApps: (userId) => {
        const members = get().members
        const member = members.find(m => m.user_id === userId)
        if (!member) return []
        
        return member.delegate_permissions.map(d => d.app_id)
      },

      getAvailableLicenses: (appId) => {
        // TODO: Calculate based on subscription and current assignments
        const maxLicenses = 10 // From subscription
        const members = get().members
        const assignedCount = members.reduce((count, member) => {
          return count + member.app_assignments.filter(a => a.app_id === appId && a.status === 'active').length
        }, 0)
        
        return maxLicenses - assignedCount
      }
    }),
    {
      name: 'forvara-roles',
      partialize: (state) => ({
        userRole: state.userRole
      })
    }
  )
)