import {Component, Input, OnInit} from '@angular/core';
import {DateTime} from "../../models/DateTime.model";

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {

  @Input() dateTimes: DateTime[];

  constructor() { }

  ngOnInit(): void {

  }

}
