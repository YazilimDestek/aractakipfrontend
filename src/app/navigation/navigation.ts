import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  
    {
        id       : 'vehicle',
                title    : 'Araç',
                translate: 'NAV.VEHICLE.TITLE',
                type     : 'item',
                icon     : 'commute',
                url      : '/vehicle'
    },
    {
        id       : 'fuel',
                title    : 'Yakıt',
                translate: 'NAV.FUEL.TITLE',
                type     : 'item',
                icon     : 'gradient',
                url      : '/fuel'
    },
    {
        id       : 'maintenance',
                title    : 'Bakım',
                translate: 'NAV.MAINTENANCE.TITLE',
                type     : 'item',
                icon     : 'build',
                url      : '/maintenance'
    },
    {
        id       : 'insurance',
                title    : 'Sigorta',
                translate: 'NAV.INSURANCE.TITLE',
                type     : 'item',
                icon     : 'import_contacts',
                url      : '/insurance'
    },
    {
        id       : 'tire',
                title    : 'Lastik',
                translate: 'NAV.TIRE.TITLE',
                type     : 'item',
                icon     : 'lens',
                url      : '/tire'
    },
    {
        id       : 'examination',
                title    : 'Muayene',
                translate: 'NAV.EXAMINATION.TITLE',
                type     : 'item',
                icon     : 'gavel',
                url      : '/examination'
    },
    {
        id       : 'staff',
                title    : 'Çalışanlar',
                translate: 'NAV.STAFF.TITLE',
                type     : 'item',
                icon     : 'people',
                url      : '/staff'
    },
    {
        id      : 'notifications',
                title   : 'Günlük Uyarılar',
                translate: 'NAV.NOTIFICATION.TITLE',
                type     : 'item',
                icon    : 'alarm',
                url      : '/notification'
    }
];
