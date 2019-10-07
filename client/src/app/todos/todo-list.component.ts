import {Component, OnInit} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';
import {Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {AddTodoComponent} from './add-todo.component';

@Component({
  selector: 'todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public todos: Todo[];
  public filteredTodos: Todo[];

  // These are the target values used in searching.
  // We should reowner them to make that clearer.
  public todoOwner: string;
  public todoStatus: boolean;
  public todoBody: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the TodoListService into this component.
  constructor(public todoListService: TodoListService, public dialog: MatDialog) {

  }

  isHighlighted(todo: Todo): boolean {
    return todo._id['$oid'] === this.highlightedID;
  }

  openDialog(): void {
    const newTodo: Todo = {_id: '', owner: '', status: false, body: '', category: ''};
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '500px',
      data: {todo: newTodo}
    });

    // tslint:disable-next-line:no-shadowed-variable
    dialogRef.afterClosed().subscribe(newTodo => {
      if (newTodo != null) {
        this.todoListService.addNewTodo(newTodo).subscribe(
          result => {
            this.highlightedID = result;
            this.refreshTodos();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the todo.');
            console.log('The newTodo or dialogResult was ' + newTodo);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public updateOwner(newOwner: string): void {
    this.todoOwner = newOwner;
    this.updateFilter();
  }

  public updateStatus(newStatus: boolean): void {
    this.todoStatus = newStatus;
    this.updateFilter();
  }

  public updateFilter() {
    this.filteredTodos =
      this.todoListService.filterTodos(
        this.todos,
        this.todoOwner,
        this.todoStatus
      );
  }

  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  refreshTodos(): Observable<Todo[]> {
    // Get Todos returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      todos => {
        this.todos = todos;
        this.updateFilter();
      },
      err => {
        console.log(err);
      });
    return todos;
  }

  loadService(): void {
    this.todoListService.getTodos(this.todoBody).subscribe(
      todos => {
        this.todos = todos;
        this.filteredTodos = this.todos;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshTodos();
    this.loadService();
  }
}
