class TodosController < ApplicationController
  def create
    todo = Todo.new(todo_params)
    render json: { data: todo }
  end
end
