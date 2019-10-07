import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {StatusValidator} from './status.validator';

@Component({
  selector: 'app-add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }

  // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    'owner': [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'},
      {type: 'existingOwner', message: 'Owner has already been taken'}
    ],

    'Status': [
      {type: 'pattern', message: 'Status must be a number'},
      {type: 'min', message: 'Status must be at least 15'},
      {type: 'max', message: 'Status may not be greater than 200'},
      {type: 'required', message: 'Status is required'}
    ],

    'category': [
      {type: 'category', message: 'Category must be formatted properly'}
    ]
  };

  createForms() {

    // add to-do form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('owner', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      // Since this is for a body, we need workers to be old enough to work, and probably not older than 200.
      status: new FormControl('status', Validators.compose([
        StatusValidator.validStatus,
        Validators.required
      ])),

      // We don't care much about what is in the body field, so we just add it here as part of the form
      // without any particular validation.
      body: new FormControl('body'),

      // We don't need a special validator just for our app here, but there is a default one for category.
      category: new FormControl('category')
    });

  }

  ngOnInit() {
    this.createForms();
  }

}
