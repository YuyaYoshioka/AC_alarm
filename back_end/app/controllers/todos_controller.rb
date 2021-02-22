class TodosController < ApplicationController
  def index
    todos = Todo.all.map { |todo| {id: todo.id, content: todo.content} }
    render json: todos
  end

  def create
    todo = Todo.new(todo_params)
    if todo.save
      render json: todo
    end
  end

  def show
    todo = Todo.find(params[:id])
    render json: todo
  end

  def update
    todo = Todo.find(params[:id])
    todo.update(content: params[:content])
  end

  def destroy
    id = params[:id]
    Todo.find(id).destroy
  end

  private

  def todo_params
    params.require(:todo).permit(:content)
  end
end
