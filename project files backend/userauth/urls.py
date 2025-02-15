from django.urls import path

from userauth.views import RegisterView, LoginView, LogoutView, UserDetailsView, UpdateUserPlanView, GetUserPlanView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailsView.as_view(), name='user_details'),
    path('update-user-plan/', UpdateUserPlanView.as_view(), name='update_user_plan'),
    path('get-user-plan/', GetUserPlanView.as_view(), name='get_user_plan'),
]