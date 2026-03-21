from .base import BaseRenderer, esc
from .concierge import ConciergeRenderer
from .direct import DirectRenderer
from .saas import SaasRenderer
from .editorial import EditorialRenderer
from .clinic import ClinicRenderer
from .sports import SportsRenderer
from .cafe import CafeRenderer
from .therapist import TherapistRenderer
from .education import EducationRenderer
from .creative import CreativeRenderer
from .telemed import TelemedRenderer
from .rehab import RehabRenderer

RENDERER_CLASSES = {
    "concierge": ConciergeRenderer,
    "direct": DirectRenderer,
    "saas": SaasRenderer,
    "editorial": EditorialRenderer,
    "clinic": ClinicRenderer,
    "sports": SportsRenderer,
    "cafe": CafeRenderer,
    "therapist": TherapistRenderer,
    "education": EducationRenderer,
    "creative": CreativeRenderer,
    "telemed": TelemedRenderer,
    "rehab": RehabRenderer,
}

__all__ = ["BaseRenderer", "esc", "RENDERER_CLASSES",
           "ConciergeRenderer", "DirectRenderer", "SaasRenderer",
           "EditorialRenderer", "ClinicRenderer", "SportsRenderer",
           "CafeRenderer", "TherapistRenderer", "EducationRenderer",
           "CreativeRenderer", "TelemedRenderer", "RehabRenderer"]
