export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      action_items: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          meeting_id: string | null
          priority: string | null
          project_id: string
          responsible_id: string | null
          status: string | null
          task_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          priority?: string | null
          project_id: string
          responsible_id?: string | null
          status?: string | null
          task_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          priority?: string | null
          project_id?: string
          responsible_id?: string | null
          status?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      baselines: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          snapshot_date: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          snapshot_date?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          snapshot_date?: string | null
        }
        Relationships: []
      }
      buffers: {
        Row: {
          consumed: number | null
          created_at: string | null
          duration: number
          id: string
          name: string
          project_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          consumed?: number | null
          created_at?: string | null
          duration: number
          id?: string
          name: string
          project_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          consumed?: number | null
          created_at?: string | null
          duration?: number
          id?: string
          name?: string
          project_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calendars: {
        Row: {
          created_at: string | null
          holidays: string[] | null
          id: string
          name: string
          project_id: string
          updated_at: string | null
          working_days: number[] | null
        }
        Insert: {
          created_at?: string | null
          holidays?: string[] | null
          id?: string
          name: string
          project_id: string
          updated_at?: string | null
          working_days?: number[] | null
        }
        Update: {
          created_at?: string | null
          holidays?: string[] | null
          id?: string
          name?: string
          project_id?: string
          updated_at?: string | null
          working_days?: number[] | null
        }
        Relationships: []
      }
      decisions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          impact_type: string | null
          impact_value: Json | null
          meeting_id: string | null
          project_id: string
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          impact_type?: string | null
          impact_value?: Json | null
          meeting_id?: string | null
          project_id: string
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          impact_type?: string | null
          impact_value?: Json | null
          meeting_id?: string | null
          project_id?: string
          task_id?: string | null
        }
        Relationships: []
      }
      meeting_participants: {
        Row: {
          attendance: string | null
          created_at: string | null
          id: string
          meeting_id: string
          stakeholder_id: string
        }
        Insert: {
          attendance?: string | null
          created_at?: string | null
          id?: string
          meeting_id: string
          stakeholder_id: string
        }
        Update: {
          attendance?: string | null
          created_at?: string | null
          id?: string
          meeting_id?: string
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_participants_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          meeting_date: string
          meeting_type: string | null
          project_id: string
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          meeting_date: string
          meeting_type?: string | null
          project_id: string
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          meeting_date?: string
          meeting_type?: string | null
          project_id?: string
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_context: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          impact: string | null
          objectives: string | null
          origin: string | null
          project_id: string
          story: string | null
          timeline: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          impact?: string | null
          objectives?: string | null
          origin?: string | null
          project_id: string
          story?: string | null
          timeline?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          impact?: string | null
          objectives?: string | null
          origin?: string | null
          project_id?: string
          story?: string | null
          timeline?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_context_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          document_type: string
          id: string
          project_id: string
          title: string
          updated_at: string | null
          version: number
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          document_type: string
          id?: string
          project_id: string
          title: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_issues: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          id: string
          project_id: string
          resolution: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id: string
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_kpis: {
        Row: {
          category: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          name: string
          project_id: string
          target_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          name: string
          project_id: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_kpis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_risks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          impact: number | null
          mitigation_plan: string | null
          owner_id: string | null
          probability: number | null
          project_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          mitigation_plan?: string | null
          owner_id?: string | null
          probability?: number | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          mitigation_plan?: string | null
          owner_id?: string | null
          probability?: number | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_risks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          name: string
          progress: number | null
          start_date: string
          status: string
          team_size: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          name: string
          progress?: number | null
          start_date: string
          status?: string
          team_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          progress?: number | null
          start_date?: string
          status?: string
          team_size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          calendar_id: string | null
          created_at: string | null
          daily_capacity: number | null
          id: string
          name: string
          project_id: string
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          calendar_id?: string | null
          created_at?: string | null
          daily_capacity?: number | null
          id?: string
          name: string
          project_id: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          calendar_id?: string | null
          created_at?: string | null
          daily_capacity?: number | null
          id?: string
          name?: string
          project_id?: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stakeholders: {
        Row: {
          communication_preference: string | null
          created_at: string | null
          email: string | null
          expectation: string | null
          id: string
          influence: string | null
          interest_level: number | null
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string | null
          power_level: number | null
          project_id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          communication_preference?: string | null
          created_at?: string | null
          email?: string | null
          expectation?: string | null
          id?: string
          influence?: string | null
          interest_level?: number | null
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          power_level?: number | null
          project_id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          communication_preference?: string | null
          created_at?: string | null
          email?: string | null
          expectation?: string | null
          id?: string
          influence?: string | null
          interest_level?: number | null
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          power_level?: number | null
          project_id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stakeholders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      task_conflicts: {
        Row: {
          conflict_type: string
          created_at: string | null
          details: Json | null
          detected_at: string | null
          id: string
          project_id: string
          resolution_action: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          task_a_id: string
          task_b_id: string | null
          updated_at: string | null
        }
        Insert: {
          conflict_type: string
          created_at?: string | null
          details?: Json | null
          detected_at?: string | null
          id?: string
          project_id: string
          resolution_action?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          task_a_id: string
          task_b_id?: string | null
          updated_at?: string | null
        }
        Update: {
          conflict_type?: string
          created_at?: string | null
          details?: Json | null
          detected_at?: string | null
          id?: string
          project_id?: string
          resolution_action?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          task_a_id?: string
          task_b_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_conflicts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_conflicts_task_a_id_fkey"
            columns: ["task_a_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_conflicts_task_b_id_fkey"
            columns: ["task_b_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          id: string
          lag_days: number | null
          predecessor_id: string
          successor_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          lag_days?: number | null
          predecessor_id: string
          successor_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          lag_days?: number | null
          predecessor_id?: string
          successor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_predecessor_id_fkey"
            columns: ["predecessor_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_successor_id_fkey"
            columns: ["successor_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_stakeholders: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          stakeholder_id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          stakeholder_id: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          stakeholder_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_stakeholders_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_stakeholders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_end_date: string | null
          baseline_duration: number | null
          baseline_end_date: string | null
          baseline_start_date: string | null
          buffer_id: string | null
          capacity_percent: number | null
          client_importance: number | null
          constraint_date: string | null
          constraint_type: string | null
          created_at: string | null
          duration: number
          early_finish: string | null
          early_start: string | null
          effort_hours: number | null
          end_date: string
          id: string
          is_critical: boolean | null
          is_milestone: boolean | null
          late_finish: string | null
          late_start: string | null
          most_likely_duration: number | null
          name: string
          optimistic_duration: number | null
          parent_id: string | null
          pessimistic_duration: number | null
          priority_business: number | null
          progress: number | null
          project_id: string
          resource_id: string | null
          sla_critical: boolean | null
          slack: number | null
          start_date: string
          status: string
          updated_at: string | null
          use_pert: boolean | null
          wbs: string
        }
        Insert: {
          actual_end_date?: string | null
          baseline_duration?: number | null
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          buffer_id?: string | null
          capacity_percent?: number | null
          client_importance?: number | null
          constraint_date?: string | null
          constraint_type?: string | null
          created_at?: string | null
          duration: number
          early_finish?: string | null
          early_start?: string | null
          effort_hours?: number | null
          end_date: string
          id?: string
          is_critical?: boolean | null
          is_milestone?: boolean | null
          late_finish?: string | null
          late_start?: string | null
          most_likely_duration?: number | null
          name: string
          optimistic_duration?: number | null
          parent_id?: string | null
          pessimistic_duration?: number | null
          priority_business?: number | null
          progress?: number | null
          project_id: string
          resource_id?: string | null
          sla_critical?: boolean | null
          slack?: number | null
          start_date: string
          status?: string
          updated_at?: string | null
          use_pert?: boolean | null
          wbs: string
        }
        Update: {
          actual_end_date?: string | null
          baseline_duration?: number | null
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          buffer_id?: string | null
          capacity_percent?: number | null
          client_importance?: number | null
          constraint_date?: string | null
          constraint_type?: string | null
          created_at?: string | null
          duration?: number
          early_finish?: string | null
          early_start?: string | null
          effort_hours?: number | null
          end_date?: string
          id?: string
          is_critical?: boolean | null
          is_milestone?: boolean | null
          late_finish?: string | null
          late_start?: string | null
          most_likely_duration?: number | null
          name?: string
          optimistic_duration?: number | null
          parent_id?: string | null
          pessimistic_duration?: number | null
          priority_business?: number | null
          progress?: number | null
          project_id?: string
          resource_id?: string | null
          sla_critical?: boolean | null
          slack?: number | null
          start_date?: string
          status?: string
          updated_at?: string | null
          use_pert?: boolean | null
          wbs?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_stats: {
        Args: never
        Returns: {
          active_users_30d: number
          active_users_7d: number
          total_users: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
