package ext.document;
import wt.doc.WTDocument;
import wt.fc.Persistable;
import wt.fc.PersistenceHelper;
import wt.inf.container.WTContainerHelper;
import wt.inf.container.WTContainerRef;
import wt.part.WTPart;
import wt.util.WTException;
import wt.util.WTPropertyVetoException;
public class CreatePart {
	
	public static void main(String[] args) throws WTPropertyVetoException, WTException {
		String container_path = "/wt.inf.container.OrgContainer=Demo Organization/wt.pdmlink.PDMLinkProduct=GOLF_CART";
		String partName="Part1";
		String partNumber="Part123";
		System.out.println("Variable Declare ");
		WTPart part = WTPart.newWTPart();
		part.setName(partName);
		part.setNumber(partNumber);
		System.out.println("name and number input successfully ");
		WTContainerRef containerRef = WTContainerHelper.service.getByPath(container_path);
		part.setContainerReference(containerRef);
		part = (WTPart) PersistenceHelper.manager.store((Persistable)part);
		System.out.println("Successfull created "+ part);
		System.out.println("Fullname:-> "+ part.getCreatorFullName()+"\nFolderPath:->  "+part.getFolderPath());
		System.out.println("Location:->  "+ part.getLocation()+"\nState:->  "+part.getState());
		System.out.println("Oraganisation:->  "+ part.getOrganizationName()+"\nLyficycleState:->  "+part.getLifeCycleState());

	}

}
