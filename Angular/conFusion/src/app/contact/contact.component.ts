import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { expand, flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  submittedFeedback: Feedback;
  contactType = ContactType;
  errMess: string;
  showForm = true;
  showLoader = false
  showDetailForm = false;
  expand = 'enter';

  formErrors: any = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages: any = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength': 'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be at least 2 characters long.',
      'maxlength': 'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    },
  };

  @ViewChild('fform', { read: NgForm }) feedbackFormDirective: any;

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    //This line below will start the spinner and hide the original form
    this.showForm = false;
    this.showLoader = true;
    this.showDetailForm = false;

    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(feedback => {

        //setting the returned values back for the display form
        this.submittedFeedback = feedback;
        this.showLoader = false;
        this.showDetailForm = true;

        setTimeout(() => {
          //This will hide the detail view and show the blank original form after 5 secs
          this.showDetailForm = false;
          this.showForm = true;

          //resetting form
          this.feedbackForm.reset({
            firstname: '',
            lastname: '',
            telnum: '',
            email: '',
            agree: false,
            contacttype: 'None',
            message: ''
          });
          this.feedbackFormDirective.resetForm();
        }, 5000);
      },
        errMess => { this.feedback = null as any; this.errMess = <any>errMess; });


  }

}
