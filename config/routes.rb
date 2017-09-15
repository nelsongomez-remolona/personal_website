Rails.application.routes.draw do
  get 'main/index'

  get 'main/case1'

  get 'main/case2'

  get 'main/case3'

  get 'main/case4'
   get 'main/case5'
      get 'main/case6'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :main
  root 'main#index'
end

