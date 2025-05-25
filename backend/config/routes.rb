Rails.application.routes.draw do
  get "home/index"
  # Root path (responds to GET "/")
  root to: "home#index"

  # API routes
  namespace :api do
    namespace :v1 do
      resources :employees
      resources :shift_types
      resources :shifts
    end
  end
end