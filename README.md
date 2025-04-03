# Utilisation de WebGL et du Web Assembly

Simulation du mouvement des molécules dans un fluide. L'affichage 3D utilise WebGL et les calculs de la physique des mouvements
est accéléré avec WebAssembly (à faire en AssemblyScript)


## Version de développement

### Installation

```
git clone git@github.com:jcbuisson/balls.git
cd balls
npm i
```

### Exécution

```
npx vite
```

## Build de la version de production

```
npx vite build
```

Les fichiers statiques sont accessibles dans /dist
