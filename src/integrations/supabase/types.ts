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
      checkins: {
        Row: {
          compromisso_id: string
          created_at: string | null
          endereco_confirmado: string | null
          foto_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          observacoes: string | null
          user_id: string
        }
        Insert: {
          compromisso_id: string
          created_at?: string | null
          endereco_confirmado?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          observacoes?: string | null
          user_id: string
        }
        Update: {
          compromisso_id?: string
          created_at?: string | null
          endereco_confirmado?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          observacoes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_compromisso_id_fkey"
            columns: ["compromisso_id"]
            isOneToOne: false
            referencedRelation: "compromissos"
            referencedColumns: ["id"]
          },
        ]
      }
      compromissos: {
        Row: {
          cliente: string
          created_at: string | null
          data: string
          endereco: string | null
          hora: string
          id: string
          imovel: string | null
          lead_id: string | null
          status: string | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data: string
          endereco?: string | null
          hora: string
          id?: string
          imovel?: string | null
          lead_id?: string | null
          status?: string | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data?: string
          endereco?: string | null
          hora?: string
          id?: string
          imovel?: string | null
          lead_id?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compromissos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      imoveis: {
        Row: {
          area: number | null
          bairro: string | null
          baixou_preco: boolean | null
          banheiros: number | null
          caracteristicas: string[] | null
          cidade: string | null
          condominio: number | null
          construtora: string | null
          created_at: string | null
          descricao: string | null
          entrega: string | null
          favorito: boolean | null
          foto: string | null
          id: string
          iptu: number | null
          modalidade: string | null
          novo: boolean | null
          preco: number
          quartos: number | null
          telefone_contato: string | null
          tipo: string
          titulo: string
          updated_at: string | null
          user_id: string
          vagas: number | null
        }
        Insert: {
          area?: number | null
          bairro?: string | null
          baixou_preco?: boolean | null
          banheiros?: number | null
          caracteristicas?: string[] | null
          cidade?: string | null
          condominio?: number | null
          construtora?: string | null
          created_at?: string | null
          descricao?: string | null
          entrega?: string | null
          favorito?: boolean | null
          foto?: string | null
          id?: string
          iptu?: number | null
          modalidade?: string | null
          novo?: boolean | null
          preco: number
          quartos?: number | null
          telefone_contato?: string | null
          tipo: string
          titulo: string
          updated_at?: string | null
          user_id: string
          vagas?: number | null
        }
        Update: {
          area?: number | null
          bairro?: string | null
          baixou_preco?: boolean | null
          banheiros?: number | null
          caracteristicas?: string[] | null
          cidade?: string | null
          condominio?: number | null
          construtora?: string | null
          created_at?: string | null
          descricao?: string | null
          entrega?: string | null
          favorito?: boolean | null
          foto?: string | null
          id?: string
          iptu?: number | null
          modalidade?: string | null
          novo?: boolean | null
          preco?: number
          quartos?: number | null
          telefone_contato?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
          vagas?: number | null
        }
        Relationships: []
      }
      interacoes: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          lead_id: string
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          lead_id: string
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          lead_id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          avatar: string | null
          bairros: string[] | null
          created_at: string | null
          email: string | null
          faixa_preco: string | null
          id: string
          interesse: string | null
          nome: string
          status: string | null
          telefone: string | null
          ultimo_contato: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          bairros?: string[] | null
          created_at?: string | null
          email?: string | null
          faixa_preco?: string | null
          id?: string
          interesse?: string | null
          nome: string
          status?: string | null
          telefone?: string | null
          ultimo_contato?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          bairros?: string[] | null
          created_at?: string | null
          email?: string | null
          faixa_preco?: string | null
          id?: string
          interesse?: string | null
          nome?: string
          status?: string | null
          telefone?: string | null
          ultimo_contato?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          cargo: string | null
          comissoes: number | null
          created_at: string | null
          email: string
          id: string
          meta: number | null
          nome: string
          ranking: number | null
          taxa_conversao: number | null
          tempo_medio_fechamento: number | null
          updated_at: string | null
          vendas: number | null
        }
        Insert: {
          avatar?: string | null
          cargo?: string | null
          comissoes?: number | null
          created_at?: string | null
          email: string
          id: string
          meta?: number | null
          nome: string
          ranking?: number | null
          taxa_conversao?: number | null
          tempo_medio_fechamento?: number | null
          updated_at?: string | null
          vendas?: number | null
        }
        Update: {
          avatar?: string | null
          cargo?: string | null
          comissoes?: number | null
          created_at?: string | null
          email?: string
          id?: string
          meta?: number | null
          nome?: string
          ranking?: number | null
          taxa_conversao?: number | null
          tempo_medio_fechamento?: number | null
          updated_at?: string | null
          vendas?: number | null
        }
        Relationships: []
      }
      propostas: {
        Row: {
          created_at: string | null
          id: string
          imovel_id: string
          lead_id: string
          observacoes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          validade: string | null
          valor_proposta: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          imovel_id: string
          lead_id: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          validade?: string | null
          valor_proposta: number
        }
        Update: {
          created_at?: string | null
          id?: string
          imovel_id?: string
          lead_id?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          validade?: string | null
          valor_proposta?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
