import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSectionService } from '../services/hive-section.service';
import { HiveSection } from '../models/hive-section';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "","", 0, false, "");
  existed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe( s => {
      if (s["id"] === undefined) {
        this.hiveSection.storeHiveId = s['storeHiveId'];
        return;
      }

      this.hiveSectionService.getHiveSection(s['id']).subscribe(h => {
        this.hiveSection = h;
        this.hiveSection.storeHiveId = s['storeHiveId'];
      });
      this.existed = true;
    })
  }

  navigateToSections() {
    this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
  }

  onCancel() {
    this.navigateToSections();
  }

  onSubmit() {
    if (!this.existed) {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(s => this.navigateToSections());
    }
    else {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(s => this.navigateToSections());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(s => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(s => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(s => this.navigateToSections());
  }




}
