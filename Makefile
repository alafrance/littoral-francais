# 📂 Config
FRONTEND_DIR=frontend
BACKEND_DIR=backend
BACKEND_ENV=$(BACKEND_DIR)/env

# 🎯 Commandes Make

# Installer toutes les dépendances (backend + frontend)
install:
	cd $(BACKEND_DIR) && python3 -m venv env && . env/bin/activate && pip install -r requirements.txt
	cd $(FRONTEND_DIR) && npm install

# Démarrer le backend FastAPI
start-backend:
	cd $(BACKEND_DIR) && . env/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Démarrer le frontend Vite/React
start-frontend:
	cd $(FRONTEND_DIR) && npm run dev -- --host

# 🚀 Lancer tout (manuel, deux terminaux nécessaires)
start:
	@echo "👉 Lancer 'make start-backend' dans un terminal"
	@echo "👉 Lancer 'make start-frontend' dans un autre terminal"

# Nettoyer l'environnement Python
clean:
	rm -rf $(BACKEND_ENV)
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -f $(FRONTEND_DIR)/package-lock.json
	rm -f $(BACKEND_DIR)/requirements.txt

# 🚀 Petit aide
help:
	@echo "📋 Commandes disponibles :"
	@echo "  make install         : Installer toutes les dépendances"
	@echo "  make start-backend    : Démarrer FastAPI backend"
	@echo "  make start-frontend   : Démarrer Vite frontend"
	@echo "  make start            : Explications pour lancer les deux"
	@echo "  make clean            : Nettoyer node_modules + env Python"
