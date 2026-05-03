-- Migration: AddEcommerceAttributesToArticle
-- Ajout des 6 colonnes e-commerce à la table article

ALTER TABLE article ADD COLUMN IF NOT EXISTS imageurl character varying(1000);
ALTER TABLE article ADD COLUMN IF NOT EXISTS sku character varying(50);
ALTER TABLE article ADD COLUMN IF NOT EXISTS statut character varying(20) DEFAULT 'Actif';
ALTER TABLE article ADD COLUMN IF NOT EXISTS slug character varying(160);
ALTER TABLE article ADD COLUMN IF NOT EXISTS isfeatured boolean DEFAULT false;
ALTER TABLE article ADD COLUMN IF NOT EXISTS matiere character varying(80);

-- Enregistrer la migration dans l'historique
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") 
VALUES ('20260311_AddEcommerceAttributesToArticle', '8.0.18')
ON CONFLICT DO NOTHING;

-- Vérification
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'article' ORDER BY ordinal_position;
