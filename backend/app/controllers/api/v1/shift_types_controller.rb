module Api
  module V1
    class ShiftTypesController < ApplicationController
      before_action :set_shift_type, only: [:show, :update, :destroy]

      def index
        render json: ShiftType.all
      end

      def show
        render json: @shift_type
      end

      def create
        shift_type = ShiftType.new(shift_type_params)
        if shift_type.save
          render json: shift_type, status: :created
        else
          render json: { errors: shift_type.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @shift_type.update(shift_type_params)
          render json: @shift_type
        else
          render json: { errors: @shift_type.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @shift_type.destroy
        head :no_content
      end

      private

      def set_shift_type
        @shift_type = ShiftType.find(params[:id])
      end

      def shift_type_params
        params.require(:shift_type).permit(:name, :color_code)
      end
    end
  end
end
