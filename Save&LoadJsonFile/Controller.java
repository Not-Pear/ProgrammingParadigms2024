import java.awt.event.MouseListener;
import java.awt.event.MouseEvent;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyListener;
import java.awt.event.KeyEvent;
import java.io.FileWriter; 
import java.io.IOException; 
import java.nio.file.Files;
import java.nio.file.Paths;

class Controller implements ActionListener, MouseListener, KeyListener
{
	View view;
	Model model;
	boolean keyLeft;
	boolean keyRight;
	boolean keyUp;
	boolean keyDown;

	Controller(Model m, View v)
	{
		this.model = m;
		this.view = v;
		this.view.addMouseListener(this);
		this.view.save_button.addActionListener(this);
		this.view.load_button.addActionListener(this);

	}

	public void actionPerformed(ActionEvent e)
	{
		if(e.getSource() == this.view.save_button)
		{
			//System.out.println("save button pressed");
			try {
				FileWriter writer = new FileWriter("map.json");
				Json ob = this.model.marshal(view);
				ob.add("scrollx", this.view.horScroll);
				ob.add("scrolly", this.view.vertScroll);
				writer.write(ob.toString());
				writer.close();

			} catch (IOException exception) {
				exception.printStackTrace();
				System.exit(1);
			}
		}
		else if (e.getSource() == this.view.load_button)
		{
			//System.out.println("load button pressed");
			try {
				String content = new String(Files.readAllBytes(Paths.get("map.json")));
				Json map = Json.parse(content);
				this.model.unmarshal(map, view);
			} catch (IOException exception) {
				exception.printStackTrace();
				System.exit(1);
			}
		} else {
			throw new RuntimeException("An unrecognized button was pushed");
		}
		//System.out.println("Hey! I said never push that button!");
	}

	public void mousePressed(MouseEvent e)
	{
		  
		if (e.getButton() == 1){
			this.model.setDestination(e.getX(), e.getY());
			if (e.getX() < 200 && e.getY() < 200) {
				this.model.change_item();
				return;
			}
			else{

				this.model.addMapItem(e.getX() + this.view.horScroll, e.getY() + this.view.vertScroll);
				this.model.sortValues();

			}

		}
		if (e.getButton() == 3)
		{

			this.model.deleteMapItem(e.getX() + this.view.horScroll, e.getY() + this.view.vertScroll);
			

		}

	}

	public void mouseReleased(MouseEvent e) 
	{	}
	
	public void mouseEntered(MouseEvent e) 
	{	}
	
	public void mouseExited(MouseEvent e) 
	{	}
	
	public void mouseClicked(MouseEvent e) 
	{	}
	
	public void keyPressed(KeyEvent e)
	{
		switch(e.getKeyCode())
		{
			case KeyEvent.VK_RIGHT: 
				this.keyRight = true; 
				break;
			case KeyEvent.VK_LEFT: 
				this.keyLeft = true; 
				break;
			case KeyEvent.VK_UP: 
				this.keyUp = true; 
				break;
			case KeyEvent.VK_DOWN: 
				this.keyDown = true; 
				break;
		}
	}

	public void keyReleased(KeyEvent e)
	{
		switch(e.getKeyCode())
		{
			case KeyEvent.VK_RIGHT: 
				this.keyRight = false; 
				break;
			case KeyEvent.VK_LEFT: 
				this.keyLeft = false; 
				break;
			case KeyEvent.VK_UP: 
				this.keyUp = false; 
				break;
			case KeyEvent.VK_DOWN: 
				this.keyDown = false; 
				break;
			case KeyEvent.VK_ESCAPE:
				System.exit(0);
		}
		char c = Character.toLowerCase(e.getKeyChar());
		if(c == 'q')
			System.exit(0);
        if(c == 'r')
            this.model.reset();
	}

	public void keyTyped(KeyEvent e)
	{	}

	void update()
	{
		if(this.keyRight) 
            this.view.horScroll += 10;
		if(this.keyLeft) 
			this.view.horScroll -= 10;
		if(this.keyDown) 
			this.view.vertScroll += 10;
		if(this.keyUp)
			this.view.vertScroll -= 10;
	}
}
