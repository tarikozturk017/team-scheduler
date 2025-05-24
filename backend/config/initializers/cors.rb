Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Allow all origins

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
      # Do NOT set credentials: true
  end
end
