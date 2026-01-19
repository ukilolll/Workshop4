import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/about-page/about-page').then(m => m.AboutPage)
    },
    {
        path: 'article',
        loadComponent: () => import('./pages/article-page/article-page').then(m => m.ArticlePage)
    },
    {
        path: 'project',
        loadComponent: () => import('./pages/project-page/project-page').then(m => m.ProjectPage)
    },
    {
        path: 'speaking',
        loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage)
    },
    {
        path: 'uses',
        loadComponent: () => import('./pages/uses-page/uses-page').then(m => m.UsesPage)
    },
        {
        path: 'demo-gis',
        loadComponent: () => import('./pages/demo-gis-page/demo-gis-page').then(m => m.DemoGisPage)
    },
    {
        path: 'workshop',
        loadComponent: () => import('./pages/workshop4-page/workshop4-page').then((m) => m.Workshop4Page),
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found-page/not-found-page').then(m => m.NotFoundPage)
    },
];
