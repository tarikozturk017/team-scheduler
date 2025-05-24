Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :employees
      resources :shift_types
      resources :shifts
    end
  end
end
