// import {ComponentFixture, TestBed, async} from '@angular/core/testing';
// import {Todo} from './todo';
// import {TodoComponent} from './todo.component';
// import {TodoListService} from './todo-list.service';
// import {Observable} from 'rxjs/Observable';
// import {CustomModule} from "../custom.module";
//
// describe('Todo component', () => {
//
//   let todoComponent: TodoComponent;
//   let fixture: ComponentFixture<TodoComponent>;
//
//   let todoListServiceStub: {
//     getTodoById: (todoId: string) => Observable<Todo>
//   };
//
//   beforeEach(() => {
//     // stub TodoService for test purposes
//     todoListServiceStub = {
//       getTodoById: (todoId: string) => Observable.of([
//         {
//           _id: 'chris_id',
//           name: 'Chris',
//           age: 25,
//           company: 'UMM',
//           email: 'chris@this.that'
//         },
//         {
//           _id: 'pat_id',
//           name: 'Pat',
//           age: 37,
//           company: 'IBM',
//           email: 'pat@something.com'
//         },
//         {
//           _id: 'jamie_id',
//           name: 'Jamie',
//           age: 37,
//           company: 'Frogs, Inc.',
//           email: 'jamie@frogs.com'
//         }
//       ].find(todo => todo._id === todoId))
//     };
//
//     TestBed.configureTestingModule({
//       imports: [CustomModule],
//       declarations: [TodoComponent],
//       providers: [{provide: TodoListService, useValue: todoListServiceStub}]
//     });
//   });
//
//   beforeEach(async(() => {
//     TestBed.compileComponents().then(() => {
//       fixture = TestBed.createComponent(TodoComponent);
//       todoComponent = fixture.componentInstance;
//     });
//   }));
//
//   it('can retrieve Pat by ID', () => {
//     todoComponent.setId('pat_id');
//     expect(todoComponent.todo).toBeDefined();
//     expect(todoComponent.todo.name).toBe('Pat');
//     expect(todoComponent.todo.email).toBe('pat@something.com');
//   });
//
//   it('returns undefined for Santa', () => {
//     todoComponent.setId('Santa');
//     expect(todoComponent.todo).not.toBeDefined();
//   });
//
// });
