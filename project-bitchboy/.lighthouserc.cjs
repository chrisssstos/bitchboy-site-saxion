module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173'],
      numberOfRuns: 1,
      settings: {
        emulatedFormFactor: 'desktop', // Force desktop mode
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.2 }],
        'categories:accessibility': ['error', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage', // Use filesystem or 'lhci server' for advanced use
    },
  }
}
