class HomeController < ApplicationController
  def index
    render json: { status: "OK", message: "Team Scheduler API is live" }
  end
end