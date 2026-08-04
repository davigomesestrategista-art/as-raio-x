CREATE TABLE public.raiox_respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  whatsapp text NOT NULL,
  email text,
  p1 text, p2 text, p3 text, p4 text, p5 text, p6 text,
  resultado text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.raiox_respostas TO anon, authenticated;
GRANT ALL ON public.raiox_respostas TO service_role;

ALTER TABLE public.raiox_respostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode enviar diagnostico"
  ON public.raiox_respostas FOR INSERT TO anon, authenticated
  WITH CHECK (true);