Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :properties
  get 'players/get', to: 'players#get'
  resources :players
  
end
