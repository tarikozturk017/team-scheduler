module Api
  module V1
    class ShiftsController < ApplicationController
      before_action :set_shift, only: [:show, :update, :destroy]

      def index
        shifts = Shift.includes(:employee, :shift_type).all
        render json: shifts.map { |shift| serialize_shift(shift) }
      end

      def show
        render json: serialize_shift(@shift)
      end

      def create
        shift = Shift.new(shift_params)
        if shift.save
          render json: serialize_shift(shift), status: :created
        else
          render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @shift.update(shift_params)
          render json: serialize_shift(@shift)
        else
          render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @shift.destroy
        head :no_content
      end

      private

      def set_shift
        @shift = Shift.find(params[:id])
      end

      def shift_params
        params.require(:shift).permit(:employee_id, :shift_type_id, :date, :start_time, :end_time)
      end

      def serialize_shift(shift)
        {
          id: shift.id,
          date: shift.date,
          start_time: shift.start_time,
          end_time: shift.end_time,
          employee: {
            id: shift.employee.id,
            name: shift.employee.name,
            role: shift.employee.role
          },
          shift_type: {
            id: shift.shift_type.id,
            name: shift.shift_type.name,
            color_code: shift.shift_type.color_code
          }
        }
      end
    end
  end
end
